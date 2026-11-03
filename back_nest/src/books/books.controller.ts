import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // 1. 모든 독서 목록 조회
  @Get()
  findAllBooks() {
    return this.booksService.findAllBooks();
  }

  // 2. 새 독서 목록 등록
  @Post()
  createBook(@Body() body: CreateBookDto) {
    return this.booksService.createBook(body);
  }

  // 3. 독서 목록 업데이트
  @Patch(':id')
  updateBook(@Param('id') id: string, @Body() body: UpdateBookDto) {
    return this.booksService.updateBook(id, body);
  }

  // 4. 독서 목록 삭제
  @Delete(':id')
  removeBook(@Param('id') id: string) {
    return this.booksService.removeBook(id);
  }

  // 5. AI 도서 추천
  @Post('recommend')
  recommendBooks(
    @Body() body: { genre: string; ageGroup: string; interests: string },
  ) {
    return this.booksService.recommendBooks(body);
  }
}
