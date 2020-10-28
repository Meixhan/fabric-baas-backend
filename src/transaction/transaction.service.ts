import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    @InjectModel('Transaction')
    private readonly TransactionModel: Model<TransactionDocument>
  ) {}

  async getTransactionBytxId(
    transactionId: string
  ): Promise<{ totalDocs: number; list: Transaction[] }> {
    const data = await this.TransactionModel.find({ txId: transactionId });
    const count: number = 1;
    return { totalDocs: count, list: data };
  }

  async getTransactionDetailByTxId(txId: string): Promise<Transaction> {
    return await this.TransactionModel.findOne({ txId: txId });
  }

  async getAllTransaction(
    paginator: number,
    pageSize: number
  ): Promise<{ totalDocs: number; list: Transaction[] }> {
    const data: Transaction[] = await this.TransactionModel.find()
      .sort('-createdAt')
      .skip(paginator)
      .limit(pageSize);
    const count: number = await this.TransactionModel.countDocuments();
    return { totalDocs: count, list: data };
  }

  async saveTransaction(
    transactionArr: Transaction[]
  ): Promise<Array<Transaction>> {
    return await this.TransactionModel.insertMany(transactionArr);
  }

  async getTransactionByBlockHash(
    blockHash: string
  ): Promise<{ totalDocs: number; list: Transaction[] }> {
    const data: Transaction[] = await this.TransactionModel.find({
      blockHash: blockHash
    });
    const count: number = await this.TransactionModel.find({
      blockHash: blockHash
    }).countDocuments();
    return { totalDocs: count, list: data };
  }
}
