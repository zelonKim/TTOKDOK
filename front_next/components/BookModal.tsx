import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook } from "@/api/books/createBook";
import { updateBook } from "@/api/books/updateBook";
import { AxiosError } from "axios";
import { BookModalProps } from "@/types/BookModalProps";
import { INITIAL_FORM_DATA } from "@/constants/INITIAL_FORM_DATA";
import { handlError } from "@/utils/handleError";
import { UpdateBookDto } from "@/types/UpdateBookDto";

export default function BookModal({ isOpen, onClose, book }: BookModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!book;

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    if (isEditMode && book) {
      setFormData({
        title: book.title || "",
        totalPages: book.totalPages || 0,
        currentPage: book.currentPage || 0,
        startDate: book.startDate ? book.startDate.split("T")[0] : "",
        targetDate: book.targetDate ? book.targetDate.split("T")[0] : "",
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [isOpen, book, isEditMode]);

  ////////////////////////////////////////////////////////////////////////////////////////

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onClose();
    },
    onError: (err: AxiosError<{ message: string | string[] }>) =>
      handlError(err, isEditMode),
  });

  ////////////////////////////////////////////////////////////////////////////////////////

  const updateBookMutation = useMutation({
    mutationFn: (data: UpdateBookDto) => updateBook(book!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onClose();
    },
    onError: (err: AxiosError<{ message: string | string[] }>) =>
      handlError(err, isEditMode),
  });

  ////////////////////////////////////////////////////////////////////////////////////////

  const isPending =
    createBookMutation.isPending || updateBookMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) return alert("책 제목을 입력해주세요.");
    if (!formData.totalPages) return alert("총 페이지 수를 입력해주세요.");
    if (isEditMode && formData.currentPage > formData.totalPages) {
      return alert("현재 페이지는 총 페이지 보다 클 수 없습니다.");
    }
    if (!formData.startDate) return alert("독서 시작일을 입력해주세요.");
    if (!formData.targetDate) return alert("목표 완독일을 입력해주세요.");

    if (isEditMode) {
      updateBookMutation.mutate({
        title: trimmedTitle,
        totalPages: Number(formData.totalPages),
        currentPage: Number(formData.currentPage),
        targetDate: formData.targetDate,
      });
    } else {
      createBookMutation.mutate({
        title: trimmedTitle,
        totalPages: Number(formData.totalPages),
        targetDate: formData.targetDate,
      });
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 px-4">
      <div className="bg-[#FDFBF7] border border-[#EFECE6] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
          <h2 className="text-xl font-extrabold text-[#2A211B]">
            {isEditMode ? "독서 정보 수정" : "새 독서 목록 등록"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[#8C7A6B] hover:text-[#362C24] text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-[#5E4837]">
              책 제목
            </label>
            <input
              type="text"
              placeholder="읽을 책의 제목을 입력하세요 (예: 위대한 개츠비)"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCDCCE] text-sm text-[#362C24] focus:outline-none focus:border-[#785E48]"
            />
          </div>

          {isEditMode && (
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-[#5E4837]">
                현재 페이지 수
              </label>
              <input
                type="number"
                min="0"
                placeholder="현재 페이지 수를 입력해주세요. (예: 20)"
                value={formData.currentPage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentPage: Number(e.target.value),
                  })
                }
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCDCCE] text-sm text-[#362C24] focus:outline-none focus:border-[#785E48]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[13px] font-bold text-[#5E4837]">
              총 페이지 수
            </label>
            <input
              type="number"
              min="1"
              placeholder="총 페이지 수를 입력해주세요. (예: 330)"
              value={formData.totalPages || ""}
              onChange={(e) =>
                setFormData({ ...formData, totalPages: Number(e.target.value) })
              }
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCDCCE] text-sm text-[#362C24] focus:outline-none focus:border-[#785E48]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-bold text-[#5E4837]">
              목표 완독일
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCDCCE] text-sm text-[#362C24] focus:outline-none focus:border-[#785E48]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-bold text-[#5E4837]">
              독서 시작일
            </label>
            <input
              type="date"
              value={formData.startDate}
              disabled
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
              className="cursor-no-drop w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCDCCE] text-sm text-[#362C24] focus:outline-none focus:border-[#785E48] disabled:bg-gray-100"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer w-1/2 py-3 rounded-xl bg-[#EFECE6] hover:bg-[#e3e2dc] text-[#5E4837] font-semibold text-sm transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-1/2 py-3 rounded-xl bg-[#785E48] hover:bg-[#5E4837] text-white font-semibold text-sm shadow-md disabled:opacity-50 transition-colors"
            >
              {isPending ? "처리 중..." : isEditMode ? "수정하기" : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
