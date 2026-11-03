import { Injectable, NotFoundException } from '@nestjs/common';
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
    // DB에서 모든 책 목록 조회
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
    return this.prisma.book.create({
      data: {
        title: dto.title,
        totalPages: dto.totalPages,
        startDate: new Date(dto.startDate),
        targetDate: new Date(dto.targetDate),
      },
    });
  }

  ////////////////////////////////////////////////

  // 3. 독서 목록 업데이트
  async updateBook(id: string, dto: UpdateBookDto) {
    // 기존 독서 정보 가져오기
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException('해당 독서 목록을 찾을 수 없습니다.');
    }

    // 전달받은 값이 없으면 기존 값 유지
    const newCurrentPage =
      dto.currentPage !== undefined ? dto.currentPage : book.currentPage;

    const totalPages = book.totalPages;

    // 완독 조건 체크 (현재 페이지가 총 페이지 수 이상인지)
    const isNowFinished = newCurrentPage >= totalPages;

    // 이전에 이미 완독 상태였는지 여부 (중복 카운팅 방지!)
    const wasAlreadyFinished = book.currentPage >= totalPages;

    let finishedReading = book.finishedReading;
    let finalCurrentPage = newCurrentPage;

    // 새롭게 완독 구간에 진입한 경우에만 실행
    if (!wasAlreadyFinished && isNowFinished) {
      finishedReading += 1; // 완독 횟수 1 증가
      finalCurrentPage = 0; // 완독 후 페이지를 0으로 리셋
    }

    // DB 업데이트
    const updatedBook = await this.prisma.book.update({
      where: { id },
      data: {
        currentPage: finalCurrentPage,
        finishedReading,
        ...(dto.realization !== undefined && {
          realization: dto.realization,
        }),
      },
    });

    const progress = calculatePagesPerDay(updatedBook);

    return {
      ...updatedBook,
      ...progress,
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
    const prompt = `
      [사용자 독서 성향 정보]:
      - 장르: ${dto.genre}
      - 연령대: ${dto.ageGroup}
      - 관심사: ${dto.interests}

      위 독서 성향 정보에 어울리는 도서 3권을 추천해 주세요.
      반드시 아래와 같은 순수 JSON 배열 형식으로만 응답해 주세요. (마크다운 백틱 백슬래시 등 다른 텍스트 포함 금지)
      [
        {
          "title": "책 제목",
          "author": "저자명",
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
