// 현재 페이지와 전체 페이지를 받아 독서 진행률을 계산하는 함수
export const calculateProgressPercent = (
  currentPage: number,
  totalPages: number,
): number => {
  if (!totalPages || totalPages <= 0) return 0;

  const percent = Math.round((currentPage / totalPages) * 100);
  return Math.min(100, Math.max(0, percent));
};
