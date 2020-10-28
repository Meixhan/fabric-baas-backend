import {
  Body,
  Controller,
  Get,
  Head,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Transaction } from './transaction.schema';
import { TransactionService } from './transaction.service';
import { query } from 'express';

@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) { }

  @Post('/list')
  getAllTransaction(@Body() pageInfo): Promise<{ totalDocs: number; list: Transaction[] }> {
    const paginator = pageInfo.paginator
    const limit = pageInfo.limit
    const transactionId = pageInfo.transactionId
    const blockHash = pageInfo.blockHash
    if (blockHash) {
      return this.transactionService.getTransactionByBlockHash(blockHash);
    } else if (transactionId) {
      return this.transactionService.getTransactionBytxId(transactionId);
    }
    else {
      return this.transactionService.getAllTransaction(paginator, limit);
    }
  }

  @Post('/saveTransaction')
  saveTransaction(@Body() transaction: Transaction[]): Promise<Array<Transaction>> {
    return this.transactionService.saveTransaction(transaction);
  }

  @Get('/:transactionId')
  getTransactionDetailByTxId(@Param('transactionId') transactionId: string): Promise<Transaction> {
    this.logger.log(`received transactionId == ${transactionId}`);
    return this.transactionService.getTransactionDetailByTxId(transactionId);
  }

}
