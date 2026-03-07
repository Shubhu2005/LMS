import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.schema';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    AuthModule, 
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, MongooseModule],
})
export class BooksModule {}
