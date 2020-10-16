import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlockInfo } from './blockInfo.model';

@Injectable()
export class BlockInfoService {
  private readonly logger = new Logger(BlockInfoService.name);

  constructor(
    @InjectModel('BlockInfo') private readonly blockInfoModel: Model<BlockInfo>
  ) {}

  async getAllBlocks(
    pageNum: number,
    pageSize: number
  ): Promise<{ totalDocs: number; list: BlockInfo[] }> {
    const data: BlockInfo[] = await this.blockInfoModel
      .find()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    const count: number = await this.blockInfoModel.countDocuments();
    return { totalDocs: count, list: data };
    // return await this.blockInfoModel.find().sort({ createdAt: -1 });
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

  async create(blockInfo: BlockInfo): Promise<BlockInfo> {
    const newBlockInfo = new this.blockInfoModel(blockInfo);
    return await newBlockInfo.save();
  }

  async createMany(blocksInfo: Array<BlockInfo>): Promise<Array<BlockInfo>> {
    return await this.blockInfoModel.insertMany(blocksInfo);
  }
}