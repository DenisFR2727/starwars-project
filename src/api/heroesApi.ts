import {
  API_BASE_URL,
  API_ENDPOINTS,
  REQUEST_DELAY,
  MAX_RETRIES,
  RETRY_DELAY,
  HTTP_STATUS,
} from "./config";
import { handleApiError } from "../utils/error";
import type { ApiResponse, Hero, Film, Starship } from "./types";

// Delay function to avoid rate limiting
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generic API wrapper function for error handling with retry logic
async function apiRequest<T>(
  url: string,
  errorMessage: string,
  retryCount = 0
): Promise<T> {
  try {
    const res = await fetch(url);

    // Handle 429 Too Many Requests with retry logic
    if (res.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      if (retryCount < MAX_RETRIES) {
        const waitTime = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        await delay(waitTime);
        return apiRequest<T>(url, errorMessage, retryCount + 1);
      }
      throw {
        code: res.status,
        message: "Too many requests. Please try again later.",
      };
    }

    if (!res.ok) {
      throw {
        code: res.status,
        message: `${errorMessage} (status ${res.status})`,
      };
    }

    return await res.json();
  } catch (error: unknown) {
    throw new Error(handleApiError(error));
  }
}

// Optimized function to fetch multiple items by IDs using batch requests
async function getItemsByIds<T extends { id: number }>(
  endpoint: string,
  ids: number[],
  itemName: string
): Promise<T[]> {
  if (ids.length === 0) {
    return [];
  }

  // Try batch request first using filter parameter
  // Format: ?id__in=1,2,3 or ?id=1&id=2&id=3
  try {
    const idsParam = ids.join(",");
    const url = `${API_BASE_URL}${endpoint}/?id__in=${idsParam}`;
    
    const response = await apiRequest<ApiResponse<T>>(
      url,
      `Failed to fetch ${itemName}`
    );

    // Sort by ID to maintain order and filter to match requested IDs
    const results = response.results
      .filter((item) => ids.includes(item.id))
      .sort((a, b) => {
        const aIndex = ids.indexOf(a.id);
        const bIndex = ids.indexOf(b.id);
        return aIndex - bIndex;
      });

    // If we got all requested items, return them
    if (results.length === ids.length) {
      return results;
    }

    // If batch request didn't return all items, fall back to individual requests
    console.warn(
      `Batch request returned ${results.length} of ${ids.length} ${itemName}, falling back to individual requests`
    );
  } catch (error) {
    // If batch request fails, fall back to individual requests
    console.warn(`Batch request failed, falling back to individual requests:`, error);
  }

  // Fallback: fetch items individually with delays to avoid rate limiting
  const results: T[] = [];
  for (let i = 0; i < ids.length; i++) {
    if (i > 0) {
      await delay(REQUEST_DELAY);
    }

    try {
      const url = `${API_BASE_URL}${endpoint}/${ids[i]}/`;
      const item = await apiRequest<T>(url, `Failed to fetch ${itemName}`);
      results.push(item);
    } catch (err) {
      console.error(`Failed to fetch ${itemName} with id ${ids[i]}:`, err);
      // Continue with other items even if one fails
    }
  }

  return results;
}

export async function getHeroes(
  currentPage: number
): Promise<ApiResponse<Hero>> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.PEOPLE}/?page=${currentPage}`;
  return apiRequest<ApiResponse<Hero>>(url, "Failed to fetch heroes");
}

export async function getHeroById(id: number): Promise<Hero> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.PEOPLE}/${id}/`;
  return apiRequest<Hero>(url, "Failed to fetch hero");
}

export async function getFilmById(id: number): Promise<Film> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.FILMS}/${id}/`;
  return apiRequest<Film>(url, "Failed to fetch film");
}

export async function getFilmsByIds(ids: number[]): Promise<Film[]> {
  return getItemsByIds<Film>(API_ENDPOINTS.FILMS, ids, "films");
}

export async function getStarshipById(id: number): Promise<Starship> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.STARSHIPS}/${id}/`;
  return apiRequest<Starship>(url, "Failed to fetch starship");
}

export async function getStarshipsByIds(ids: number[]): Promise<Starship[]> {
  return getItemsByIds<Starship>(API_ENDPOINTS.STARSHIPS, ids, "starships");
}
