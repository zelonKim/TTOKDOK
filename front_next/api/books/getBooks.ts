import { client } from "../client";
import { Book } from "@/types/Book";

export const getBooks = async (): Promise<Book[]> => {
  const response = await client.get("/books");
  return response.data;
};
