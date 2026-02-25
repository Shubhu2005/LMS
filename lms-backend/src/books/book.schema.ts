// books/schemas/book.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: true })
  isAvailable: boolean; // critical
}

export type BookDocument = Book & Document;
export const BookSchema = SchemaFactory.createForClass(Book);
