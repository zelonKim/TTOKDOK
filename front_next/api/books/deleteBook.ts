import { client } from "../client";

export const deleteBook = async (id: string): Promise<void> => {
  await client.delete(`/books/${id}`);
};
