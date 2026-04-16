import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnquiryDocument = Enquiry & Document;

@Schema({ timestamps: true })
export class Enquiry {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  serviceRequired: string;

  @Prop({ required: false })
  briefRequirement: string;
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);
