import { handleApiError } from "../utils/error";
import type { ApiResponse, Hero } from "./types";

export async function getHeroes(
  currentPage: number
): Promise<ApiResponse<Hero>> {
  try {
    const res = await fetch(
      `https://sw-api.starnavi.io/people/?page=${currentPage}`
    );

    if (!res.ok) {
      throw {
        code: res.status,
        message: `Failed to fetch heroes (status ${res.status})`,
      };
    }

    return await res.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  } finally {
    console.log("Heroes API call finished");
  }
}
