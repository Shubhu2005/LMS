// borrow/schemas/borrow.schema.ts

import { Schema } from "@nestjs/mongoose/dist/decorators/schema.decorator";
import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BorrowStatus } from '../common/enums/borrow-status.enum';
import * as mongoose from 'mongoose';
@Schema({ timestamps: true })
export class Borrow {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  book: mongoose.Types.ObjectId;

  @Prop({ enum: BorrowStatus, default: BorrowStatus.REQUESTED })
  status: BorrowStatus;

  @Prop()
  issuedAt?: Date;

  @Prop()
  returnedAt?: Date;
}

export type BorrowDocument = Borrow & Document;
export const BorrowSchema = SchemaFactory.createForClass(Borrow);