"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/api/books/getBooks";
import { formatDate } from "@/utils/formatDate";
import { calculateProgressPercent } from "@/utils/calculateProgressPercent";

export default function BooksPage() {
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
        <div className="flex flex-col gap-3 text-center py-90 text-[#8C7A6B] font-semibold  ">
          <div>데이터를 불러오는 중 오류가 발생했습니다. ⚠️</div>
          <Link
            href="/"
            className="text-sm text-[#8C7A6B] hover:font-black transition-colors"
          >
            ← 홈으로 돌아가기
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
            className="text-xs text-[#8C7A6B] hover:text-[#362C24] transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2A211B] mt-1">
            독서 목록 관리 📖
          </h1>
        </div>
      </div>
      
      {books.length === 0 ? (
        <div className="text-center py-20 bg-white/60 border border-[#EFECE6] rounded-2xl">
          <p className="text-[#8C7A6B]">아직 등록된 목록이 없습니다.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => {
              return (
                <div
                  key={book.id}
                  className="bg-white/95 border border-[#EFECE6] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#EFECE6] text-[#785E48]">
                        📚 완독 {book.finishedReading}회
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#2A211B] line-clamp-2">
                      {book.title}
                    </h3>

                    <div className="text-xs text-[#8C7A6B] space-y-1 pt-1">
                      <div className="flex justify-between">
                        <span>시작일:</span>
                        <span className="font-medium text-[#5E4837]">
                          {formatDate(book.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>목표일:</span>
                        <span className="font-medium text-[#5E4837]">
                          {formatDate(book.targetDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#F2EFE9]">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-[#5E4837]">
                        <span>독서 진행률</span>
                        <span>
                          {book.currentPage} / {book.totalPages}p (
                          {calculateProgressPercent(
                            book.currentPage,
                            book.totalPages,
                          )}
                          %)
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
