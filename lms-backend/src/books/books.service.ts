import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './book.schema';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  // 🔥 1. CREATE BOOK
  async create(dto: any) {
    const book = await this.bookModel.create(dto);
    return {
      message: 'Book created successfully',
      data: book,
    };
  }

  // 🔥 2. GET ALL BOOKS (Pagination + Search + Genre Filter)
  async findAll(
    page: number,
    limit: number,
    search?: string,
    genre?: string,
  ) {
    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre) {
      query.genre = genre;
    }

    const books = await this.bookModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.bookModel.countDocuments(query);

    return {
      data: books,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // 🔥 3. GET SINGLE BOOK
  async findOne(id: string) {
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  // 🔥 4. UPDATE BOOK RATING
  async updateRating(id: string, rating: number) {
    if (rating < 0 || rating > 5) {
      throw new BadRequestException('Rating must be between 0 and 5');
    }

    const book = await this.bookModel.findByIdAndUpdate(
      id,
      { rating },
      { new: true },
    );

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return {
      message: 'Rating updated successfully',
      data: book,
    };
  }

  // 🔥 5. DELETE BOOK
  async delete(id: string) {
    const book = await this.bookModel.findByIdAndDelete(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return {
      message: 'Book deleted successfully',
    };
  }
}
