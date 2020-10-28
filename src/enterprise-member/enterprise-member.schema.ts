import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnterpriseMemberDocument = EnterpriseMember & Document;
@Schema({ timestamps: { createdAt: true } })
export class EnterpriseMember {
  @Prop()
  companyName: string;
  @Prop()
  companyCertBusinessNumber: string;
  @Prop()
  companyAddress: string;
  @Prop()
  companyDesc: string;
  @Prop()
  legalPersonName: string;
  @Prop()
  legalPersonIdCardNumber: string;
  @Prop()
  contactName: string;
  @Prop()
  contactPhone: string;
  @Prop()
  contactCell: string;
  @Prop()
  contactEmail: string;
  @Prop()
  approveTime: string;
  @Prop()
  approvalStatus: number;
  @Prop()
  isValid: number;
}

export const EnterpriseMemberSchema = SchemaFactory.createForClass(
  EnterpriseMember
);
