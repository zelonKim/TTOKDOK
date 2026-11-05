import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { calculatePagesPerDay } from 'utils/caculatePagesPerDay';

@Injectable()
export class BooksService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(private prisma: PrismaService) {}

  // 1. 모든 독서 목록 조회
  async findAllBooks() {
    const books = await this.prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return books.map((book) => {
      const progress = calculatePagesPerDay(book); // 유틸 함수를 호출하여 계산값을 매핑

      return {
        ...book,
        ...progress,
      };
    });
  }

  ////////////////////////////////////////////////

  // 2. 새 독서 목록 등록
  async createBook(dto: CreateBookDto) {
    const trimmedTitle = dto.title.trim();
    const startDate = new Date();
    const targetDate = new Date(dto.targetDate);

    const existingBook = await this.prisma.book.findFirst({
      where: { title: trimmedTitle },
    });

    if (existingBook) {
      throw new BadRequestException('이미 존재하는 독서 제목입니다.');
    }

    if (targetDate.getTime() < startDate.getTime()) {
      throw new BadRequestException(
        '목표 완독일은 독서 시작일보다 더 빠를 수 없습니다.',
      );
    }

    if (targetDate.getTime() === startDate.getTime()) {
      throw new BadRequestException(
        '목표 완독일은 독서 시작일과 같을 수 없습니다.',
      );
    }

    return this.prisma.book.create({
      data: {
        title: trimmedTitle,
        totalPages: dto.totalPages,
        startDate,
        targetDate,
      },
    });
  }

  ////////////////////////////////////////////////

  // 3. 독서 목록 업데이트
  async updateBook(id: string, dto: UpdateBookDto) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException('해당 독서 목록을 찾을 수 없습니다.');
    }

    const newTitle = dto.title !== undefined ? dto.title.trim() : book.title;

    //  제목이 이미 존재하는지 검사
    const existingBook = await this.prisma.book.findFirst({
      where: { title: newTitle },
    });

    // 만약 동일한 제목을 가진 책이 이미 존재하고, 그 책의 ID가 현재 수정 중인 ID와 다르다면 에러 발생
    if (existingBook && existingBook.id !== id) {
      throw new BadRequestException('이미 존재하는 독서 제목입니다.');
    }

    const startDate = book.startDate;

    const targetDate = dto.targetDate
      ? new Date(dto.targetDate)
      : book.targetDate;

    if (targetDate.getTime() < startDate.getTime()) {
      throw new BadRequestException(
        '목표 완독일은 독서 시작일보다 더 빠를 수 없습니다.',
      );
    }

    if (targetDate.getTime() === startDate.getTime()) {
      throw new BadRequestException(
        '목표 완독일은 독서 시작일과 같을 수 없습니다.',
      );
    }

    // 전달받은 값이 없으면 기존 값 유지
    const totalPages =
      dto.totalPages !== undefined ? dto.totalPages : book.totalPages;
    const newCurrentPage =
      dto.currentPage !== undefined ? dto.currentPage : book.currentPage;

      
    if (newCurrentPage > totalPages) {
      throw new BadRequestException(
        '현재 읽은 페이지는 총 페이지 수를 초과할 수 없습니다.',
      );
    }
    // 완독 조건 체크
    const isNowFinished = newCurrentPage >= totalPages;
    const wasAlreadyFinished = book.currentPage >= book.totalPages;

    const isNewlyCompleted =
      (!wasAlreadyFinished && isNowFinished) ||
      (newCurrentPage >= totalPages && book.currentPage < totalPages);

    let finishedReading = book.finishedReading;
    let finalCurrentPage = newCurrentPage;

    if (isNewlyCompleted) {
      finishedReading += 1; // 완독 횟수 1 증가
      finalCurrentPage = 0; // 완독 후 페이지를 0으로 리셋
    }

    // DB 업데이트
    const updatedBook = await this.prisma.book.update({
      where: { id },
      data: {
        title: newTitle,
        totalPages,
        currentPage: finalCurrentPage,
        startDate,
        targetDate,
        finishedReading,
      },
    });

    return {
      updatedBook,
    };
  }

  ////////////////////////////////////////////////

  // 4. 독서 목록 삭제
  async removeBook(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }

  ////////////////////////////////////////////////

  // 5. AI 도서 추천
  async recommendBooks(dto: {
    genre: string;
    ageGroup: string;
    interests: string;
  }) {
    const genre = dto.genre?.trim();
    const ageGroup = dto.ageGroup?.trim();
    const interests = dto.interests?.trim();

    if (!genre) {
      throw new BadRequestException('장르를 입력해주세요.');
    }
    if (!ageGroup) {
      throw new BadRequestException('연령대를 입력해주세요.');
    }
    if (!interests) {
      throw new BadRequestException('관심사를 입력해주세요.');
    }

    const prompt = `
      [사용자 독서 성향 정보]:
      - 장르: ${dto.genre}
      - 연령대: ${dto.ageGroup}
      - 관심사: ${dto.interests}

      위 독서 성향 정보에 어울리는 도서 3권을 추천해 주세요.

      [추천 지침]:
      1. 책 제목(title)과 저자명(author)은 반드시 한국어로 출판된 정식 번역본 명칭(한글)으로 작성해 주세요. (예: "The Intelligent Investor" -> "현명한 투자자", "Benjamin Graham" -> "벤저민 그레이엄")
      2. 외국 도서라도 국내에 정식 출판된 한국어 제목이 있다면 반드시 한국어 제목으로 출력해야 합니다.

      반드시 아래와 같은 순수 JSON 배열 형식으로만 응답해 주세요. (마크다운 백틱 백슬래시 등 다른 텍스트 포함 금지)
      [
        {
          "title": "책 제목 (한국어 출간명)",
          "author": "저자명 (한글 표기)",
          "reason": "추천 이유 (3줄 내외)"
        }
      ]
      `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('AI 도서 추천 중 오류 발생:', error);
      throw new Error('AI 도서 추천 중 오류가 발생했습니다.');
    }
  }
}
