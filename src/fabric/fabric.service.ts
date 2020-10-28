import * as path from 'path';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { helper } from './common/helper';
import { FabricClient } from './client/fabric/FabricClient';
import { FabricConfig } from './client/fabric/FabricConfig';
import { createFabricClient } from './client/fabric/utils/FabricUtils';
import { Block } from './model/block.model';
import { BlockInfoService } from 'src/block-info/block-info.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { Semaphore } from 'await-semaphore';
import {
  convertBlockToDBItem,
  convertTransactionToDBItem
} from './converter/blockConverters';

const fs = require('fs-extra');
const config_path = path.resolve(__dirname, './config.json');
const NETWORK_CONFIGS = 'network-configs';
const MESSAGE_1002 =
  'Sync process is started for the network = [%s] and client = [%s]';
const ERROR_2014 = 'Invalid platform configuration, Please check the log';
const ERROR_2011 = 'There is no client found for Hyperledger fabric scanner';

@Injectable()
export class FabricService implements OnModuleInit {
  private readonly logger = new Logger(FabricService.name);
  private semaphore = new Semaphore(1);

  network_id: string;
  network_name: string;
  client: FabricClient;
  eventHub: any;
  sender: any;
  persistence: any;
  syncService: any;
  blocksSyncTime: number;
  network_config: object;

  constructor(
    private readonly blockInfoService: BlockInfoService,
    private readonly transactionService: TransactionService
  ) {
    this.network_id = null;
    this.network_name = null;
    this.client = null;
    this.eventHub = null;
  }

  async onModuleInit() {
    this.initialize();
  }

  async initialize() {
    const allConfig = JSON.parse(fs.readFileSync(config_path, 'utf8'));
    const networkConfig = allConfig[NETWORK_CONFIGS];

    // Get the first network and first client
    this.network_id = Object.keys(networkConfig)[0];
    this.network_name = networkConfig[this.network_id].name;

    this.logger.log(MESSAGE_1002 + this.network_id + this.network_name);

    this.logger.debug('Blocks synch interval time >> ' + this.blocksSyncTime);

    this.network_config = networkConfig[this.network_id];
    const config = new FabricConfig();
    config.initialize(this.network_id, this.network_config);
    this.client = await createFabricClient(config, null);

    if (!this.client) {
      throw new Error(ERROR_2011);
    }
  }

  async getChannelDetails() {
    return await this.client.initializeChannelFromDiscover('mychannel');
  }

  async getGenesisBlock() {
    const block = (await this.client.fabricGateway.queryBlock(
      'mychannel',
      0
    )) as Block;
    this.logger.log(block.header);
    return block;
  }
  // TODO change it to minute
  @Cron(CronExpression.EVERY_30_SECONDS)
  async syncFromFabricNetwork() {
    let release = null;
    try {
      release = await this.semaphore.acquire();
      this.logger.log('sync called every 1 minute');
      const channel_name = 'mychannel';

      // Get channel information from ledger
      const channelInfo = await this.client.fabricGateway.queryChainInfo(
        channel_name
      );
      const channel_genesis_hash = this.client.getChannelGenHash(channel_name);
      this.logger.log('channel_genesis_hash:' + channel_genesis_hash);
      const blockHeight = parseInt(channelInfo.height.low) - 1;
      // Query missing blocks from DB
      // TODO fetch the latest horizon
      const tip = await this.blockInfoService.getTip(channel_genesis_hash);
      this.logger.log('tip:' + tip);
      const results = await this.blockInfoService.getMissingBlockInfoInRange(
        tip,
        blockHeight,
        channel_genesis_hash
      );
      if (results && results.length) {
        for (const missingId of results) {
          // Get block by number
          const block = (await this.client.fabricGateway.queryBlock(
            channel_name,
            missingId
          )) as Block;
          if (block) {
            //   await this.processBlockEvent(client, block);
            this.logger.debug('block:' + JSON.stringify(block.header));
            // TODO process and save the block
            // get the latest block hash
            const prev_block_hash = await this.blockInfoService.getLatestBlockHash(
              channel_genesis_hash
            );

            this.logger.log('saving the block');
            convertBlockToDBItem(
              block,
              channel_genesis_hash,
              prev_block_hash
            ).then(data => {
              this.blockInfoService.create(data);
            });

            this.logger.log('retrieving block data:');
            convertTransactionToDBItem(block).then(data => {
              this.logger.log(data);
              if (data.length) {
                this.transactionService.saveTransaction(data);
                this.logger.log('transactions saved');
              }
            });
          }
        }
        await this.blockInfoService.updateTip(
          channel_genesis_hash,
          tip,
          blockHeight
        );
      } else {
        this.logger.debug(`missing blocks not found for ${channel_name}`);
      }
    } finally {
      if (release) {
        release();
      }
    }
  }

  async createFabricClient(config, persistence) {
    // Create new FabricClient
    const client = new FabricClient(config);
    // Initialize fabric client
    this.logger.debug(
      '************ Initializing fabric client for [%s]************',
      config.getNetworkId()
    );
    try {
      await client.initialize(persistence);
      return client;
    } catch (err) {
      throw new Error(ERROR_2014);
    }
  }
}
