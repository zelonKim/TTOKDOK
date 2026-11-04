import { AxiosError } from "axios";

export const handlError = (
  err: AxiosError<{ message: string | string[] }>,
  isEditMode?: boolean,
) => {
  const serverMessage = err.response?.data?.message;
  if (Array.isArray(serverMessage)) {
    alert(serverMessage[0]);
  } else if (typeof serverMessage === "string") {
    alert(serverMessage);
  } else {
    alert(
      isEditMode
        ? "독서 목록 수정 중 오류가 발생했습니다."
        : "독서 목록 등록 중 오류가 발생했습니다.",
    );
  }
};
