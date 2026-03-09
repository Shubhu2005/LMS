import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './book.schema';
import { Model } from 'mongoose';

@Injectable()
export class BooksService implements OnModuleInit {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.bookModel.countDocuments();
    if (count === 0) {
      console.log('Seeding sample books...');
      const samples = [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', rating: 4.5, isAvailable: true },
        { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', rating: 4.8, isAvailable: true },
        { title: '1984', author: 'George Orwell', genre: 'Dystopian', rating: 4.7, isAvailable: true },
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', rating: 4.9, isAvailable: true },
        { title: 'Clean Code', author: 'Robert C. Martin', genre: 'Education', rating: 4.8, isAvailable: true },
        { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', rating: 4.3, isAvailable: true },
        { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', rating: 4.9, isAvailable: true },
        { title: 'Educated', author: 'Tara Westover', genre: 'Biography', rating: 4.7, isAvailable: true },
      ];
      await this.bookModel.insertMany(samples);
      console.log('Sample books seeded!');
    }
  }

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
