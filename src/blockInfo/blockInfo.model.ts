import * as mongoose from 'mongoose';
import { IsNumber } from 'class-validator';

export interface BlockInfo {
  number: number;
  dataHash: string;
  previousHash: string;
  txCount: number;
  blockHash: string;
  prevBlockHash: string;
  blockSize: string;
  channelGenesisHash: string;
}

export const BlockInfoSchema = new mongoose.Schema(
  {
    number: Number,
    dataHash: String,
    previousHash: String,
    txCount: Number,
    blockHash: String,
    prevBlockHash: String,
    blockSize: String,
    channelGenesisHash: String
  },
  { timestamps: { createdAt: true } }
);

BlockInfoSchema.index({ number: 1, channelGenesisHash: 1 }, { unique: true });

// we need this DTO to be a class for validation purpose
export class BlockRange {
  @IsNumber()
  low: number;

  @IsNumber()
  high: number;

  channelGenesisHash: string;
}
