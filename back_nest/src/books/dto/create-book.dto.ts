import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CreateBookDto {
  @IsString({ message: '책 제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '책 제목은 비워둘 수 없습니다.' })
  title!: string;

  @IsInt({ message: '총 페이지 수는 정수여야 합니다.' })
  @Min(1, { message: '총 페이지 수는 최소 1페이지 이상이어야 합니다.' })
  @Max(9999, { message: '총 페이지 수는 9999페이지를 초과할 수 없습니다.' })
  totalPages!: number;

  @IsDateString({}, { message: '올바른 목표 완독일 형식이어야 합니다.' })
  targetDate!: string;
}
