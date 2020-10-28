// import * as mongoose from 'mongoose';
// export const BlockInfoSchema = new mongoose.Schema(
//   {
//     number: Number,
//     dataHash: String,
//     previousHash: String,
//     txCount: Number,
//     blockHash: String,
//     prevBlockHash: String,
//     blockSize: String,
//     channelGenesisHash: String,
//     channelName: String,
//     tip: { type: Number, sparse: true }
//   },
//   { timestamps: { createdAt: true } }
// );

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlockInfoDocument = BlockInfo & Document;
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class BlockInfo {
  @Prop()
  number: number;
  @Prop()
  dataHash: string;
  @Prop()
  previousHash: string;
  @Prop()
  txCount: number;
  @Prop()
  blockHash: string;
  @Prop()
  prevBlockHash: string;
  @Prop()
  blockSize: string;
  @Prop()
  channelGenesisHash: string;
  @Prop()
  channelName: string;
  @Prop({ required: false, sparse: true })
  tip: number;
}

export const BlockInfoSchema = SchemaFactory.createForClass(BlockInfo);

BlockInfoSchema.index({ number: 1, channelGenesisHash: 1 }, { unique: true });
BlockInfoSchema.index({ tip: 1 }, { sparse: true });
