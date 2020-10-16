import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { query } from 'winston';
import { BlockInfo, BlockRange } from './blockInfo.model';
import { BlockInfoService } from './blockInfo.service';

@Controller('blocks')
export class BlockInfoController {
  private readonly logger = new Logger(BlockInfoController.name);

  constructor(private readonly blockInfoService: BlockInfoService) {}

  @Post('/allBlocks')
  getAllBlocks(
    @Body() pageInfo
  ): Promise<{ totalDocs: number; list: BlockInfo[] }> {
    const pageNum = pageInfo.parameters.pageNum;
    const pageSize = pageInfo.parameters.pageSize;
    const blockHash = pageInfo.parameters.blockHash;
    this.logger.log(`received pageNum = ${pageNum}`);
    this.logger.log(`received pageSize = ${pageSize}`);
    this.logger.log(`received blockHash = ${blockHash}`);
    if (blockHash === '') {
      return this.blockInfoService.getAllBlocks(pageNum, pageSize);
    } else {
      return this.blockInfoService.getBlock(blockHash);
    }
  }

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  )
  queryMissingBlocks(@Query() query: BlockRange): Promise<any> {
    return this.blockInfoService.getMissingBlockInfoInRange(
      query.low,
      query.high,
      query.channelGenesisHash
    );
  }

  @Get('/blockDetail')
  getBlockInfo(@Query() query): Promise<BlockInfo> {
    const blockHash = query.blockHash;
    this.logger.log(`received blockHash = ${blockHash}`);
    return this.blockInfoService.getBlockInfo(blockHash);
  }

  @Post('/post')
  create(@Body() blockInfo: BlockInfo): Promise<BlockInfo> {
    return this.blockInfoService.create(blockInfo);
  }

  @Post('/createBlocks')
  createMany(@Body() blocksInfo: Array<BlockInfo>): Promise<Array<BlockInfo>> {
    return this.blockInfoService.createMany(blocksInfo);
  }
}