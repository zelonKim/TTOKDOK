// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 초기화
  await prisma.book.deleteMany();

  await prisma.book.createMany({
    data: [
      {
        title: '어린왕자',
        totalPages: 120,
        currentPage: 30,
        startDate: new Date('2026-11-01'),
        targetDate: new Date('2026-11-20'),
        finishedReading: 0,
        realization: '가장 중요한 것은 눈에 보이지 않는다.',
      },
      {
        title: '데미안',
        totalPages: 250,
        currentPage: 100,
        startDate: new Date('2026-11-05'),
        targetDate: new Date('2026-11-30'),
        finishedReading: 1,
        realization: '새는 알을 깨고 나오기 위해 투쟁한다.',
      },
      {
        title: '소유냐 존재냐',
        totalPages: 320,
        currentPage: 120,
        startDate: new Date('2026-11-10'),
        targetDate: new Date('2026-11-15'),
        finishedReading: 0,
        realization:
          '소유 중심의 삶에서 벗어나 진정한 존재의 삶을 지향해야 한다.',
      },
      {
        title: '돈키호테',
        totalPages: 550,
        currentPage: 90,
        startDate: new Date('2026-11-02'),
        targetDate: new Date('2026-12-01'),
        finishedReading: 0,
        realization: '이상을 품고 살아가는 낭만은 세상을 변화시키는 힘이 된다.',
      },
      {
        title: '죄와 벌',
        totalPages: 600,
        currentPage: 90,
        startDate: new Date('2026-11-02'),
        targetDate: new Date('2026-12-01'),
        finishedReading: 0,
        realization: '인간은 고통을 통해 비로소 진정한 자신을 마주한다.',
      },
      {
        title: '보통의 존재',
        totalPages: 272,
        currentPage: 0,
        startDate: new Date('2026-11-15'),
        targetDate: new Date('2026-11-30'),
        finishedReading: 2,
        realization: '평범한 일상 속에서도 우리 각자의 이야기는 빛난다.',
      },
    ],
  });

  console.log('시드 데이터가 성공적으로 입력되었습니다!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
