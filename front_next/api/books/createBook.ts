import { Book } from "@/types/Book";
import { client } from "../client";
import { CreateBookDto } from "@/types/CreateBookDto";

export const createBook = async (data: CreateBookDto): Promise<Book> => {
  const response = await client.post("/books", data);
  return response.data;
};
