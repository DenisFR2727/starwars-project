import { handleApiError } from "../utils/error";
import type { ApiResponse, Hero, Film, Starship } from "./types";

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

export async function getHeroById(id: number): Promise<Hero> {
  try {
    const res = await fetch(`https://sw-api.starnavi.io/people/${id}/`);

    if (!res.ok) {
      throw {
        code: res.status,
        message: `Failed to fetch hero (status ${res.status})`,
      };
    }

    return await res.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getFilmById(id: number): Promise<Film> {
  try {
    const res = await fetch(`https://sw-api.starnavi.io/films/${id}/`);

    if (!res.ok) {
      throw {
        code: res.status,
        message: `Failed to fetch film (status ${res.status})`,
      };
    }

    return await res.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getFilmsByIds(ids: number[]): Promise<Film[]> {
  try {
    const films = await Promise.all(ids.map((id) => getFilmById(id)));
    return films;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getStarshipById(id: number): Promise<Starship> {
  try {
    const res = await fetch(`https://sw-api.starnavi.io/starships/${id}/`);

    if (!res.ok) {
      throw {
        code: res.status,
        message: `Failed to fetch starship (status ${res.status})`,
      };
    }

    return await res.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getStarshipsByIds(ids: number[]): Promise<Starship[]> {
  try {
    const starships = await Promise.all(ids.map((id) => getStarshipById(id)));
    return starships;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
