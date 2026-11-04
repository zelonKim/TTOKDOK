// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 초기화
  await prisma.book.deleteMany();

  const today = new Date();

  //  오늘로부터 특정 일수 뒤의 Date 객체를 반환하는 헬퍼 함수
  const afterDays = (days: number) => {
    const target = new Date();
    target.setDate(today.getDate() + days);
    return target;
  };

  await prisma.book.createMany({
    data: [
      {
        title: '어린왕자',
        totalPages: 120,
        currentPage: 20,
        startDate: today,
        targetDate: afterDays(5),
        finishedReading: 0,
      },
      {
        title: '데미안',
        totalPages: 250,
        currentPage: 100,
        startDate: today,
        targetDate: afterDays(10),
        finishedReading: 0,
      },
      {
        title: '소유냐 존재냐',
        totalPages: 320,
        currentPage: 20,
        startDate: today,
        targetDate: afterDays(15),
        finishedReading: 0,
      },
      {
        title: '돈키호테',
        totalPages: 550,
        currentPage: 150,
        startDate: new Date(),
        targetDate: afterDays(20),
        finishedReading: 0,
      },
      {
        title: '죄와 벌',
        totalPages: 600,
        currentPage: 100,
        startDate: new Date(),
        targetDate: afterDays(25),
        finishedReading: 0,
      },
      {
        title: '보통의 존재',
        totalPages: 300,
        currentPage: 0,
        startDate: new Date(),
        targetDate: afterDays(30),
        finishedReading: 0,
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
