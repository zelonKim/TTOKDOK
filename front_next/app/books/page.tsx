"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooks } from "@/api/books/getBooks";
import { formatDate } from "@/utils/formatDate";
import { calculateProgressPercent } from "@/utils/calculateProgressPercent";
import { useState } from "react";
import { Book } from "@/types/Book";
import { deleteBook } from "@/api/books/deleteBook";
import {
  ArrowLeft,
  Book,
  BookCheck,
  BookOpen,
  BookOpenCheck,
  BookPlus,
  CalendarArrowRight,
  CalendarCheck,
  Loader,
  Trash2,
} from "lucide-react";
import BookModal from "@/components/BookModal";

export default function BooksPage() {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleCardClick = (book: Book) => {
    setIsEditModalOpen(true);
    setSelectedBook(book);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: deleteBookMutation } = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    if (window.confirm("정말로 해당 목록을 삭제하시겠습니까?")) {
      deleteBookMutation(id);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const {
    data: books = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  if (isPending) {
    return (
      <div className="text-center py-90 text-[#8C7A6B] font-semibold">
        독서 목록을 불러오는 중입니다... 📖
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex flex-col gap-3 text-center py-90 text-[#8C7A6B]  ">
          <div className="font-semibold">
            데이터를 불러오는 중 오류가 발생했습니다. ⚠️
          </div>
          <Link
            href="/"
            className="flex flex-row text-sm justify-center items-center gap-1 text-[#8C7A6B] hover:font-semibold transition-colors"
          >
            <ArrowLeft size={12} /> 홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#362C24] px-6 sm:px-12 py-12">
      <div className="max-w-5xl mx-auto flex items-center justify-between pb-8 border-b border-[#EFECE6]">
        <div>
          <Link
            href="/"
            className="hover:font-semibold flex flex-row gap-1 items-center  text-sm text-[#8C7A6B]  transition-colors"
          >
            <ArrowLeft size={12} />
            <span className="">홈으로 돌아가기</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2A211B] mt-2">
            독서 목록 관리 📖
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer px-5 py-3 rounded-xl bg-[#785E48] hover:bg-[#5E4837] text-white font-semibold text-[15px] shadow-md transition-all transform  flex items-center gap-2 hover:shadow-lg"
        >
          <span>독서 목록 등록하기</span>
          <span>
            <BookPlus size={15} />
          </span>
        </button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20 bg-white/60 border border-[#EFECE6] rounded-2xl">
          <p className="text-[#8C7A6B]">아직 등록된 목록이 없습니다.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {books.map((book) => {
              return (
                <div
                  key={book.id}
                  onClick={() => handleCardClick(book)}
                  className="group relative cursor-pointer hover:scale-101 hover:bg-white/90 bg-white/95 border border-[#EFECE6] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, book.id)}
                    className="cursor-pointer absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-[#8C7A6B] hover:text-red-500 rounded-xl hover:bg-red-50"
                    title="독서 목록 삭제"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#EFECE6] text-[#785E48]">
                        📚 완독 {book.finishedReading}회
                      </span>
                    </div>

                    <h3 className="flex flex-row justify-between items-center text-xl font-bold text-[#2A211B] line-clamp-2 ">
                      {book.title}
                    </h3>

                    <div className="text-[13px] font-medium text-[#8C7A6B] space-y-1 pt-1 ml-1">
                      <div className="flex items-center gap-1">
                        <CalendarArrowRight size={12} />
                        <span>독서 시작일:</span>
                        <span className=" text-[#5E4837]">
                          {formatDate(book.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarCheck size={12} />
                        <span> 목표 완독일:</span>
                        <span className=" text-[#5E4837]">
                          {formatDate(book.targetDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#F2EFE9]">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[13px] font-medium text-[#5E4837]">
                        <div className="flex flex-row items-center gap-1">
                          <BookCheck size={12} />
                          <span>독서 진행률</span>
                          <span className="font-extrabold ">
                            (
                            {calculateProgressPercent(
                              book.currentPage,
                              book.totalPages,
                            )}
                            %)
                          </span>
                        </div>
                        <span className="font-semibold">
                          {book.currentPage} / {book.totalPages}쪽
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#EFECE6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#785E48] rounded-full transition-all duration-300"
                          style={{
                            width: `${calculateProgressPercent(
                              book.currentPage,
                              book.totalPages,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-1 font-semibold justify-center items-center text-[13px] bg-[#FDFBF7] px-3 py-2 rounded-xl border border-[#F2EFE9] text-[#785E48]">
                      📖
                      <span>
                        하루 권장 독서량:{" "}
                        <strong className="font-bold text-[#785E48]">
                          {book.recommendedPagesPerDay}쪽
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <BookModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
      />
    </main>
  );
}
