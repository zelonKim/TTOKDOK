"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getBookRecommendations } from "@/api/books/recommendBook";
import Link from "next/link";
import { ArrowLeft, Book, Bot, User } from "lucide-react";
import { RecommendResponse } from "@/types/RecommendResponse";
import { handleBuyBook } from "@/utils/handleBuyBook";
import { handlError } from "@/utils/handleError";
import { AxiosError } from "axios";

export default function RecommendPage() {
  const [formData, setFormData] = useState({
    genre: "",
    ageGroup: "",
    interests: "",
  });

  const [recommendations, setRecommendations] = useState<RecommendResponse[]>(
    [],
  );

  useEffect(() => {
    const savedForm = sessionStorage.getItem("recommend_form");
    const savedResults = sessionStorage.getItem("recommend_results");

    if (savedForm) {
      try {
        setFormData(JSON.parse(savedForm));
      } catch (e) {
        console.error(e);
      }
    }

    if (savedResults) {
      try {
        setRecommendations(JSON.parse(savedResults));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleFormChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    sessionStorage.setItem("recommend_form", JSON.stringify(updated));
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const BookRecsMutation = useMutation({
    mutationFn: getBookRecommendations,
    onSuccess: (data) => {
      setRecommendations(data);
      sessionStorage.setItem("recommend_results", JSON.stringify(data));
    },
    onError: (err: AxiosError<{ message: string | string[] }>) =>
      handlError(err),
  });

  const handleRecsSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formData.genre.trim()) return alert("장르를 입력해주세요");
    if (!formData.ageGroup.trim()) return alert("연령대를 입력해주세요");
    if (!formData.interests.trim()) return alert("관심사를 입력해주세요");
    BookRecsMutation.mutate(formData);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#362C24] px-6 sm:px-12 py-8">
      <Link
        href="/"
        className="hover:font-semibold flex flex-row gap-1 items-center  text-sm text-[#8C7A6B]  transition-colors"
      >
        <ArrowLeft size={12} />
        <span className="">홈으로 돌아가기</span>
      </Link>
      <div className="max-w-xl mx-auto space-y-8 pt-10">
        <div className="text-center space-y-2">
          <h1 className="text-[28px] font-black text-[#5E4837]">
            AI 맞춤 도서 추천 🤖
          </h1>
          <p className="text-sm text-[#8C7A6B]">
            장르, 나이대, 관심사를 입력하면 AI가 어울리는 책을 추천해줍니다.
          </p>
        </div>

        <div className="bg-white/95 border border-[#EFECE6] p-8 rounded-3xl shadow-sm">
          <form onSubmit={handleRecsSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[13.5px] font-bold text-[#5E4837]">
                선호 장르
              </label>
              <input
                type="text"
                placeholder="예: 소설, 수필, 에세이, 시, 비문학 등"
                value={formData.genre}
                onChange={(e) => handleFormChange("genre", e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white border border-[#DCD6CE] text-[15px] text-[#362C24] focus:outline-none  focus:border-[#785E48]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13.5px] font-bold text-[#5E4837]">
                연령대
              </label>
              <input
                type="text"
                placeholder="예: 20대 후반, 30대 중반 등"
                value={formData.ageGroup}
                onChange={(e) => handleFormChange("ageGroup", e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white border border-[#DCD6CE] text-[15px] text-[#362C24] focus:outline-none focus:border-[#785E48]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13.5px] font-bold text-[#5E4837]">
                현재 관심사
              </label>
              <textarea
                rows={3}
                placeholder="예: 인간관계, 연애, 재테크, 역사, 정치 등"
                value={formData.interests}
                onChange={(e) => handleFormChange("interests", e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white border border-[#DCD6CE] text-[15px] text-[#362C24] focus:outline-none focus:border-[#785E48] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={BookRecsMutation.isPending}
              className="w-full py-3.5 rounded-xl bg-[#785E48] hover:bg-[#5E4837] text-white font-semibold text-base shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {BookRecsMutation.isPending ? (
                <span>AI가 책을 고르고 있어요...🤖</span>
              ) : (
                <div className="flex flex-row gap-1 items-center justify-center">
                  <span>맞춤 도서 추천받기</span>
                  <Bot size={18} />
                </div>
              )}
            </button>
          </form>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl font-extrabold text-[#2A211B] pt-4 border-t border-[#EFECE6]">
              ✨ AI 추천 결과
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((book, index) => (
                <div
                  key={index}
                  onClick={() => handleBuyBook(book.title, book.author)}
                  className="hover:scale-101 cursor-pointer transition-all duration-200 hover:bg-white bg-white/95 border border-[#EFECE6] p-6 rounded-2xl shadow-sm hover:shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex flex-row gap-1 items-center text-xs font-bold px-3 py-1 rounded-full bg-[#EFECE6] text-[#785E48]">
                      <Book size={12} />
                      추천 도서 {index + 1}
                    </span>
                    <span className="flex flex-row gap-1 items-center text-[12.5px] font-medium text-[#8C7A6B]">
                      <User size={12} />
                      저자: {book.author}
                    </span>
                  </div>

                  <h3 className="text-xl ml-1 font-bold text-[#2A211B]">
                    {book.title}
                  </h3>

                  <div className="flex flex-col gap-1 text-[14.5px] text-[#785E48] leading-relaxed bg-[#FDFBF7] p-4 rounded-xl border border-[#F2EFE9]">
                    <div className="flex items-center font-semibold  gap-1">
                      <Bot size={16} className="mb-1" />
                      <span>왜 이 책을 추천하나요?</span>
                    </div>
                    <span>{book.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
