import { BookReadingStatus } from 'types/BookReadingStatus';

// 독서 상황을 바탕으로 남은 일수, 남은 페이지 수, 하루 권장 독서량을 계산하는 함수
export function calculatePagesPerDay(status: BookReadingStatus) {
  const today = new Date();
  const target = new Date(status.targetDate);
  const diffTime = target.getTime() - today.getTime();

  // 남은 일수(D-day) 계산
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 남은 페이지 수 계산
  const remainingPages = status.totalPages - status.currentPage;

  // 하루 권장 독서량 산출
  let recommendedPagesPerDay = 0;
  if (remainingDays > 0) {
    recommendedPagesPerDay = Math.ceil(remainingPages / remainingDays);
  } else {
    recommendedPagesPerDay = remainingPages > 0 ? remainingPages : 0;
  }

  return {
    remainingDays: remainingDays > 0 ? remainingDays : 0,
    remainingPages,
    recommendedPagesPerDay,
  };
}
