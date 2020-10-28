import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { BlockRange } from './block-info.model';
import { BlockInfo } from './block-info.schema';
import { BlockInfoService } from './block-info.service';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('blocks')
export class BlockInfoController {
  private readonly logger = new Logger(BlockInfoController.name);

  constructor(private readonly blockInfoService: BlockInfoService) {}

  @Post('/list')
  getAllBlocks(
    @Body() pageInfo
  ): Promise<{ totalDocs: number; list: BlockInfo[] }> {
    const paginator = pageInfo.paginator;
    const limit = pageInfo.limit;
    const blockHash = pageInfo.blockHash;
    this.logger.log(`received paginator = ${paginator}`);
    this.logger.log(`received limit = ${limit}`);
    this.logger.log(`received blockHash = ${blockHash}`);
    if (!blockHash) {
      return this.blockInfoService.getAllBlocks(paginator, limit);
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

  @Get('/:blockHash')
  getBlockInfo(@Param('blockHash') blockHash: string): Promise<BlockInfo> {
    this.logger.log(`received blockHash = ${blockHash}`);
    if (!blockHash) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: '需要请求参数 blockHash',
          error: 'blockHash is required'
        },
        HttpStatus.BAD_REQUEST
      );
      //TODO create class definition for message and error
    }
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
