// src/books/dto/update-book.dto.ts
import { IsInt, IsOptional, Min } from 'class-validator';
import { CreateBookDto } from './create-book.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsInt()
  @Min(0, { message: '현재 페이지는 0 이상이어야 합니다.' })
  @IsOptional()
  currentPage?: number;
}
