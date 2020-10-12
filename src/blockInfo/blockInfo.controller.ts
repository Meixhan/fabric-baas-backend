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
import { BlockInfo, BlockRange } from './blockInfo.model';
import { BlockInfoService } from './blockInfo.service';

@Controller('blocks')
export class BlockInfoController {
  private readonly logger = new Logger(BlockInfoController.name);

  constructor(private readonly blockInfoService: BlockInfoService) {}

  @Get('/allBlocks')
  getAllBlocks(): Promise<any> {
    return this.blockInfoService.getAllBlocks();
  }

  @Get('/:blockHash')
  getBlockInfo(@Param('blockHash') blockHash: string): Promise<BlockInfo> {
    this.logger.log(`received blockHash = ${blockHash}`);
    return this.blockInfoService.getBlockInfo(blockHash);
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

  @Post('/post')
  create(@Body() blockInfo: BlockInfo): Promise<BlockInfo> {
    return this.blockInfoService.create(blockInfo);
  }

  @Post('/createBlocks')
  createMany(@Body() blocksInfo: Array<BlockInfo>): Promise<Array<BlockInfo>> {
    return this.blockInfoService.createMany(blocksInfo);
  }
}
