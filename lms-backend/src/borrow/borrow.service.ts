import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Borrow, BorrowDocument } from './borrow.schema';
import { Book, BookDocument } from '../books/book.schema';
import { Model } from 'mongoose';
import { BorrowStatus } from '../common/enums/borrow-status.enum';

@Injectable()
export class BorrowService {
  constructor(
    @InjectModel(Borrow.name)
    private readonly borrowModel: Model<BorrowDocument>,

    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  // 🔥 1. USER → REQUEST BOOK
  async requestBook(bookId: string, userId: string) {
    const book = await this.bookModel.findById(bookId);
    if (!book) throw new NotFoundException('Book not found');

    if (!book.isAvailable)
      throw new BadRequestException('Book is not available');

    // Prevent duplicate active request
    const existing = await this.borrowModel.findOne({
      user: userId,
      book: bookId,
      status: { $in: [BorrowStatus.REQUESTED, BorrowStatus.ISSUED] },
    });

    if (existing)
      throw new BadRequestException(
        'You already requested or borrowed this book',
      );

    const borrow = await this.borrowModel.create({
      user: userId,
      book: bookId,
      status: BorrowStatus.REQUESTED,
    });

    return {
      message: 'Book request submitted successfully',
      data: borrow,
    };
  }

  // 🔥 2. USER → VIEW OWN BORROWS
  async getMyBorrows(userId: string) {
    return this.borrowModel
      .find({ user: userId })
      .populate('book')
      .sort({ createdAt: -1 });
  }

  // 🔥 3. MANAGER → VIEW PENDING REQUESTS
  async getPendingRequests() {
    return this.borrowModel
      .find({ status: BorrowStatus.REQUESTED })
      .populate('user')
      .populate('book')
      .sort({ createdAt: -1 });
  }

  // 🔥 4. MANAGER → APPROVE REQUEST
  async approveRequest(borrowId: string) {
    const borrow = await this.borrowModel
      .findById(borrowId)
      .populate('book');

    if (!borrow) throw new NotFoundException('Borrow record not found');

    if (borrow.status !== BorrowStatus.REQUESTED)
      throw new BadRequestException('Invalid borrow status');

    // Make sure book still available
    const book = await this.bookModel.findById(borrow.book._id);

    if (!book.isAvailable)
      throw new BadRequestException('Book already issued');

    borrow.status = BorrowStatus.ISSUED;
    borrow.issuedAt = new Date();

    await this.bookModel.findByIdAndUpdate(book._id, {
      isAvailable: false,
    });

    await borrow.save();

    return {
      message: 'Book issued successfully',
      data: await this.borrowModel.findById(borrowId).populate(['user', 'book']),
    };
  }

  // 🔥 5. MANAGER → DECLINE REQUEST
  async declineRequest(borrowId: string) {
    const borrow = await this.borrowModel.findById(borrowId);

    if (!borrow) throw new NotFoundException('Borrow record not found');

    if (borrow.status !== BorrowStatus.REQUESTED)
      throw new BadRequestException('Invalid borrow status');

    borrow.status = BorrowStatus.DECLINED;
    await borrow.save();

    return {
      message: 'Request declined',
      data: await this.borrowModel.findById(borrowId).populate(['user', 'book']),
    };
  }

  // 🔥 6. MANAGER → RETURN BOOK
  async returnBook(borrowId: string) {
    const borrow = await this.borrowModel
      .findById(borrowId)
      .populate('book');

    if (!borrow) throw new NotFoundException('Borrow record not found');

    if (borrow.status !== BorrowStatus.ISSUED)
      throw new BadRequestException('Book is not issued');

    borrow.status = BorrowStatus.RETURNED;
    borrow.returnedAt = new Date();

    await this.bookModel.findByIdAndUpdate(borrow.book._id, {
      isAvailable: true,
    });

    await borrow.save();

    return {
      message: 'Book returned successfully',
      data: await this.borrowModel.findById(borrowId).populate(['user', 'book']),
    };
  }

  // 🔥 7. ADMIN → VIEW ALL BORROWS
  async getAllBorrows() {
    return this.borrowModel
      .find()
      .populate('user')
      .populate('book')
      .sort({ createdAt: -1 });
  }
}
