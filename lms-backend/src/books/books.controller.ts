import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { RolesGuard } from '../admin/guards/roles.guard';
import { Roles } from '../admin/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UpdateRatingDto } from './dto/update-rating.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // 🔥 1. CREATE BOOK (ADMIN ONLY)

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new book (Admin only)' })
  create(@Body() dto: CreateBookDto) {
  return this.booksService.create(dto);
}

  // 🔥 2. GET ALL BOOKS (PUBLIC - Pagination + Search + Genre)

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination and filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'genre', required: false })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('genre') genre?: string,
  ) {
    return this.booksService.findAll(
      Number(page),
      Number(limit),
      search,
      genre,
    );
  }

  // 🔥 3. GET SINGLE BOOK

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  // 🔥 4. UPDATE RATING (ADMIN + MANAGER)

  @Patch(':id/rating')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update book rating (Admin, Manager)' })
updateRating(
  @Param('id') id: string,
  @Body() dto: UpdateRatingDto,
) {
  return this.booksService.updateRating(id, dto.rating);
}
  // 🔥 5. DELETE BOOK (ADMIN ONLY)

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete book (Admin only)' })
  delete(@Param('id') id: string) {
    return this.booksService.delete(id);
  }
}
