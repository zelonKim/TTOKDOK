export interface Book {
  id: string;
  title: string;
  totalPages: number;
  currentPage: number;
  startDate: string;
  targetDate: string;
  realization?: string;
  finishedReading: number;
  createdAt: string;
  updatedAt: string;
}
