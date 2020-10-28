
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: { updatedAt: true } })
export class Transaction {
  @Prop()
  blockHash: string;
  @Prop()
  chainCodeId: number;
  @Prop()
  chainCodeName: string;
  @Prop()
  channelId: number;
  @Prop()
  channelName: string;
  @Prop()
  createdAt: string
  @Prop()
  isValid: number;
  @Prop()
  showDataRole: boolean;
  @Prop()
  txArgs: any[];
  @Prop()
  txEndorseMsp: any[];
  @Prop()
  txMsp: string;
  @Prop()
  txId: string;
  @Prop()
  leagueName: string;

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
