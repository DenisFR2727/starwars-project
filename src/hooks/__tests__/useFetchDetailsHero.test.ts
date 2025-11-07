import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useParams } from "react-router";
import useFetchDetailsHero from "../useFetchDetailsHero";
import * as heroesApi from "../../api/heroesApi";
import type { Hero, Film, Starship } from "../../api/types";

// Mock react-router
vi.mock("react-router", () => ({
  useParams: vi.fn(),
}));

// Mock the API module
vi.mock("../../api/heroesApi");

describe("useFetchDetailsHero", () => {
  const mockHero: Hero = {
    id: 1,
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
    homeworld: 1,
    films: [1, 2],
    species: [1],
    vehicles: [1, 2],
    starships: [1, 2],
    created: "2014-12-09T13:50:51.644000Z",
    edited: "2014-12-20T21:17:56.891000Z",
    url: "https://sw-api.starnavi.io/people/1/",
  };

  const mockFilm1: Film = {
    id: 1,
    title: "A New Hope",
    episode_id: 4,
    opening_crawl: "It is a period of civil war...",
    director: "George Lucas",
    producer: "Gary Kurtz, Rick McCallum",
    release_date: "1977-05-25",
    characters: [1, 2, 3],
    planets: [1, 2],
    starships: [1, 2],
    vehicles: [1, 2],
    species: [1, 2],
    created: "2014-12-10T14:23:31.880000Z",
    edited: "2014-12-20T19:49:45.256000Z",
    url: "https://sw-api.starnavi.io/films/1/",
  };

  const mockFilm2: Film = {
    id: 2,
    title: "The Empire Strikes Back",
    episode_id: 5,
    opening_crawl: "It is a dark time for the Rebellion...",
    director: "Irvin Kershner",
    producer: "Gary Kurtz, Rick McCallum",
    release_date: "1980-05-17",
    characters: [1, 2, 3],
    planets: [1, 2],
    starships: [1, 2, 3],
    vehicles: [1, 2],
    species: [1, 2],
    created: "2014-12-12T11:26:24.656000Z",
    edited: "2014-12-15T13:07:53.386000Z",
    url: "https://sw-api.starnavi.io/films/2/",
  };

  const mockStarship1: Starship = {
    id: 1,
    name: "X-wing",
    model: "T-65 X-wing",
    manufacturer: "Incom Corporation",
    cost_in_credits: "149999",
    length: "12.5",
    max_atmosphering_speed: "1050",
    crew: "1",
    passengers: "0",
    cargo_capacity: "110",
    consumables: "1 week",
    hyperdrive_rating: "1.0",
    MGLT: "100",
    starship_class: "Starfighter",
    pilots: [1],
    films: [1, 2],
    created: "2014-12-12T11:19:05.340000Z",
    edited: "2014-12-20T21:23:49.886000Z",
    url: "https://sw-api.starnavi.io/starships/1/",
  };

  const mockStarship2: Starship = {
    id: 2,
    name: "Millennium Falcon",
    model: "YT-1300 light freighter",
    manufacturer: "Corellian Engineering Corporation",
    cost_in_credits: "100000",
    length: "34.37",
    max_atmosphering_speed: "1050",
    crew: "4",
    passengers: "6",
    cargo_capacity: "100000",
    consumables: "2 months",
    hyperdrive_rating: "0.5",
    MGLT: "75",
    starship_class: "Light freighter",
    pilots: [1, 2],
    films: [1, 2],
    created: "2014-12-10T16:59:45.094000Z",
    edited: "2014-12-20T21:23:49.880000Z",
    url: "https://sw-api.starnavi.io/starships/2/",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch hero details successfully", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(heroesApi.getHeroById).mockResolvedValue(mockHero);
    vi.mocked(heroesApi.getFilmsByIds).mockResolvedValue([
      mockFilm1,
      mockFilm2,
    ]);
    vi.mocked(heroesApi.getStarshipsByIds).mockResolvedValue([
      mockStarship1,
      mockStarship2,
    ]);

    const { result } = renderHook(() => useFetchDetailsHero());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.graphData.hero).toBeNull();

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // After loading, data should be set
    expect(result.current.graphData.hero).toEqual(mockHero);
    expect(result.current.graphData.films).toEqual([mockFilm1, mockFilm2]);
    expect(result.current.graphData.starships).toEqual([
      mockStarship1,
      mockStarship2,
    ]);
    expect(result.current.error).toBeNull();

    // Verify API calls
    expect(heroesApi.getHeroById).toHaveBeenCalledWith(1);
    expect(heroesApi.getFilmsByIds).toHaveBeenCalledWith([1, 2]);
    expect(heroesApi.getStarshipsByIds).toHaveBeenCalledWith([1, 2]);
  });

  it("should handle missing id parameter", async () => {
    vi.mocked(useParams).mockReturnValue({ id: undefined });

    const { result } = renderHook(() => useFetchDetailsHero());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("ID hero not specified");
    expect(result.current.graphData.hero).toBeNull();
    expect(heroesApi.getHeroById).not.toHaveBeenCalled();
  });

  it("should handle empty films array", async () => {
    const heroWithoutFilms: Hero = {
      ...mockHero,
      films: [],
    };

    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(heroesApi.getHeroById).mockResolvedValue(heroWithoutFilms);
    vi.mocked(heroesApi.getStarshipsByIds).mockResolvedValue([mockStarship1]);

    const { result } = renderHook(() => useFetchDetailsHero());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.graphData.hero).toEqual(heroWithoutFilms);
    expect(result.current.graphData.films).toEqual([]);
    expect(heroesApi.getFilmsByIds).not.toHaveBeenCalled();
  });

  it("should handle empty starships array", async () => {
    const heroWithoutStarships: Hero = {
      ...mockHero,
      starships: [],
    };

    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(heroesApi.getHeroById).mockResolvedValue(heroWithoutStarships);
    vi.mocked(heroesApi.getFilmsByIds).mockResolvedValue([mockFilm1]);

    const { result } = renderHook(() => useFetchDetailsHero());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.graphData.hero).toEqual(heroWithoutStarships);
    expect(result.current.graphData.starships).toEqual([]);
    expect(heroesApi.getStarshipsByIds).not.toHaveBeenCalled();
  });

  it("should handle API errors when fetching hero", async () => {
    const errorMessage = "Failed to fetch hero";
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(heroesApi.getHeroById).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchDetailsHero());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.graphData.hero).toBeNull();
    expect(result.current.graphData.films).toEqual([]);
    expect(result.current.graphData.starships).toEqual([]);
  });

  it("should handle API errors when fetching films", async () => {
    const errorMessage = "Failed to fetch films";
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(heroesApi.getHeroById).mockResolvedValue(mockHero);
    vi.mocked(heroesApi.getFilmsByIds).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useFetchDetailsHero());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
  });

  it("should handle API errors when fetching starships", async () => {
    const errorMessage = "Failed to fetch starships";
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(heroesApi.getHeroById).mockResolvedValue(mockHero);
    vi.mocked(heroesApi.getFilmsByIds).mockResolvedValue([mockFilm1]);
    vi.mocked(heroesApi.getStarshipsByIds).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useFetchDetailsHero());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
  });

  it("should refetch when id changes", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(heroesApi.getHeroById).mockResolvedValue(mockHero);
    vi.mocked(heroesApi.getFilmsByIds).mockResolvedValue([mockFilm1]);
    vi.mocked(heroesApi.getStarshipsByIds).mockResolvedValue([mockStarship1]);

    const { result, rerender } = renderHook(() => useFetchDetailsHero());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(heroesApi.getHeroById).toHaveBeenCalledWith(1);
    expect(heroesApi.getHeroById).toHaveBeenCalledTimes(1);

    // Change id
    const mockHero2: Hero = {
      ...mockHero,
      id: 2,
      name: "Darth Vader",
    };

    vi.mocked(useParams).mockReturnValue({ id: "2" });
    vi.mocked(heroesApi.getHeroById).mockResolvedValue(mockHero2);

    rerender();

    // Should be loading again
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(heroesApi.getHeroById).toHaveBeenCalledWith(2);
    expect(heroesApi.getHeroById).toHaveBeenCalledTimes(2);
    expect(result.current.graphData.hero?.id).toBe(2);
  });

  it("should parse id as integer correctly", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "42" });
    vi.mocked(heroesApi.getHeroById).mockResolvedValue(mockHero);
    vi.mocked(heroesApi.getFilmsByIds).mockResolvedValue([]);
    vi.mocked(heroesApi.getStarshipsByIds).mockResolvedValue([]);

    renderHook(() => useFetchDetailsHero());

    await waitFor(() => {
      expect(heroesApi.getHeroById).toHaveBeenCalled();
    });

    expect(heroesApi.getHeroById).toHaveBeenCalledWith(42);
  });
});
