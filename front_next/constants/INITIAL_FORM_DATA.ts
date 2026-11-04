import { BookModalDto } from "@/types/BookModalDto";
import { getTodayString } from "@/utils/getTodayString";

export const INITIAL_FORM_DATA: BookModalDto = {
  title: "",
  totalPages: 0,
  currentPage: 0,
  startDate: getTodayString(),
  targetDate: "",
};
