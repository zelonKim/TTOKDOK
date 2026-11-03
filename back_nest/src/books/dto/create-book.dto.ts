import { IsString, IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: '책 제목을 입력해주세요.' })
  title!: string;

  @IsInt()
  @IsNotEmpty({ message: '총 페이지 수를 입력해주세요.' })
  totalPages!: number;

  @IsDateString(
    {},
    { message: '올바른 날짜 형식을 입력해주세요. (YYYY-MM-DD)' },
  )
  @IsNotEmpty({ message: '독서 시작일을 입력해주세요.' })
  startDate!: string;

  @IsDateString(
    {},
    { message: '올바른 날짜 형식을 입력해주세요. (YYYY-MM-DD)' },
  )
  @IsNotEmpty({ message: '목표 완독일을 입력해주세요.' })
  targetDate!: string;
}
