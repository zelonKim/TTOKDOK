import { Book } from "@/types/Book";
import { client } from "../client";
import { UpdateBookDto } from "@/types/UpdateBookDto";

export const updateBook = async (
  id: string,
  data: UpdateBookDto,
): Promise<Book> => {
  const response = await client.patch(`/books/${id}`, data);
  return response.data;
};
