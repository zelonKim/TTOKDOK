import { RecommendRequestDto } from "@/types/RecommendRequestDto";
import { client } from "../client";
import { RecommendResponse } from "@/types/RecommendResponse";

export const getBookRecommendations = async (
  data: RecommendRequestDto,
): Promise<RecommendResponse[]> => {
  const response = await client.post("/books/recommend", data);
  return response.data;
};
