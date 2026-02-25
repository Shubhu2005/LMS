import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Borrow, BorrowSchema } from './borrow.schema';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Borrow.name, schema: BorrowSchema }]),
    BooksModule,
  ],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
