import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlockInfo, BlockInfoDocument } from './block-info.schema';

@Injectable()
export class BlockInfoService {
  private readonly logger = new Logger(BlockInfoService.name);

  constructor(
    @InjectModel('BlockInfo')
    private readonly blockInfoModel: Model<BlockInfoDocument>
  ) {}

  async getAllBlocks(
    paginator: number,
    limit: number
  ): Promise<{ totalDocs: number; list: BlockInfo[] }> {
    const data: BlockInfo[] = await this.blockInfoModel
      .find()
      .skip(paginator)
      .limit(limit)
      .sort({ createdAt: -1 });
    const count: number = await this.blockInfoModel.countDocuments();
    return { totalDocs: count, list: data };
  }

  async getBlock(
    blockHash: string
  ): Promise<{ totalDocs: number; list: BlockInfo[] }> {
    const list = [];
    const data = await this.blockInfoModel.findOne({ blockHash: blockHash });
    list.push(data);
    const count: number = 1;
    return { totalDocs: count, list: list };
  }

  async getBlockInfo(blockHash: string): Promise<BlockInfo> {
    const data = await this.blockInfoModel.findOne({ blockHash: blockHash });
    return data;
  }

  async getMissingBlockInfoInRange(
    low: number,
    high: number,
    channelGenesisHash: string
  ): Promise<any> {
    this.logger.log(typeof low);

    const range: any[] = await this.blockInfoModel.find(
      {
        channelGenesisHash: channelGenesisHash,
        number: { $gte: low, $lte: high }
      },
      { number: 1 }
    );
    const missingIds = [];
    const allIds = new Set(range.map(blockInfo => blockInfo.number));
    for (let i = low; i <= high; i++) {
      if (!allIds.has(i)) {
        this.logger.log('pushing: ' + i);
        this.logger.log(typeof i);
        missingIds.push(i);
      }
    }
    return missingIds;
  }

  async getLatestBlockHash(channelGenesisHash: string): Promise<string> {
    const count: number = await this.blockInfoModel.countDocuments();
    if (!count) {
      this.logger.log('count:' + count);
      this.logger.log('no block exists');
      return '';
    } else {
      const latestBlock: BlockInfo[] = await this.blockInfoModel
        .find({
          channelGenesisHash: channelGenesisHash
        })
        .limit(1)
        .sort({ createdAt: -1 });
      this.logger.log('latest block:');
      this.logger.log(latestBlock);
      const latestBlockHash = latestBlock[0].blockHash;
      this.logger.log('latest block hash:' + latestBlockHash);
      return latestBlockHash;
    }
  }

  async getTip(channelGenesisHash: string): Promise<number> {
    const count: number = await this.blockInfoModel.countDocuments();
    if (!count) {
      return 0;
    } else {
      const tipBlock = await this.blockInfoModel.find({
        channelGenesisHash: channelGenesisHash,
        tip: { $gt: 0 }
      });
      return tipBlock[0].tip;
    }
  }

  async updateTip(
    channelGenesisHash: string,
    low: number,
    high: number
  ): Promise<any> {
    const prevTipBlock = await this.blockInfoModel
      .findOne({
        tip: { $gte: 0 }
      })
      .sort({ tip: -1 });
    const tipBlock = await this.blockInfoModel
      .findOne({
        channelGenesisHash: channelGenesisHash,
        number: { $gte: low, $lte: high }
      })
      .sort({ number: -1 });
    const tipBlockNumber: number = tipBlock.number; // used as tip value
    if (prevTipBlock) {
      const prevTip = prevTipBlock.tip;
      this.logger.log('previous tip:' + prevTip);
      this.logger.log('latest tip:' + tipBlockNumber);
      if (tipBlockNumber < prevTip) {
        this.logger.error('latest tip is invalid');
        return;
      }
    }

    // previous block with 'tip' field will have this field removed
    if (prevTipBlock) {
      this.logger.log('removing prevTipBlock');
      this.logger.log('prevTipBlock:');
      this.logger.log(prevTipBlock);
      await this.blockInfoModel.update(
        { number: prevTipBlock.number },
        {
          $unset: {
            tip: ''
          }
        }
      );
    }

    this.logger.log('tipBlockNumber:' + tipBlockNumber);
    await this.blockInfoModel.update(
      { number: tipBlockNumber },
      {
        $set: {
          tip: tipBlockNumber
        }
      }
    );

    // just for test
    const checkTipBlock = await this.blockInfoModel
      .find()
      .limit(1)
      .sort({ createdAt: -1 });
    this.logger.log('checkTipBlock');
    this.logger.log(checkTipBlock[0]);
  }

  async create(blockInfo: BlockInfo): Promise<BlockInfo> {
    const newBlockInfo = new this.blockInfoModel(blockInfo);
    return await newBlockInfo.save();
  }

  async createMany(blocksInfo: Array<BlockInfo>): Promise<Array<BlockInfo>> {
    return await this.blockInfoModel.insertMany(blocksInfo);
  }
}
