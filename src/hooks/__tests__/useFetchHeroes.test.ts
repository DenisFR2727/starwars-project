import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useFetchHeroes from '../useFetchHeroes';
import * as heroesApi from '../../api/heroesApi';
import type { Hero, ApiResponse } from '../../api/types';

// Mock the API module
vi.mock('../../api/heroesApi');

describe('useFetchHeroes', () => {
  const mockHeroes: Hero[] = [
    {
      id: 1,
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 1,
      films: [1, 2, 3],
      species: [1],
      vehicles: [1, 2],
      starships: [1, 2],
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      url: 'https://sw-api.starnavi.io/people/1/',
    },
    {
      id: 2,
      name: 'Darth Vader',
      height: '202',
      mass: '136',
      hair_color: 'none',
      skin_color: 'white',
      eye_color: 'yellow',
      birth_year: '41.9BBY',
      gender: 'male',
      homeworld: 1,
      films: [1, 2, 3],
      species: [1],
      vehicles: [],
      starships: [1],
      created: '2014-12-10T15:18:20.704000Z',
      edited: '2014-12-20T21:17:50.313000Z',
      url: 'https://sw-api.starnavi.io/people/2/',
    },
  ];

  const mockApiResponse: ApiResponse<Hero> = {
    count: 82,
    next: 'https://sw-api.starnavi.io/people/?page=2',
    previous: null,
    results: mockHeroes,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch heroes successfully', async () => {
    vi.mocked(heroesApi.getHeroes).mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useFetchHeroes(1));

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.heroes).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // After loading, heroes should be set
    expect(result.current.heroes).toEqual(mockHeroes);
    expect(result.current.totalPages).toBe(9); // Math.ceil(82 / 10)
    expect(result.current.error).toBeNull();
    expect(heroesApi.getHeroes).toHaveBeenCalledWith(1);
    expect(heroesApi.getHeroes).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch heroes';
    vi.mocked(heroesApi.getHeroes).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useFetchHeroes(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.heroes).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.totalPages).toBe(1);
  });

  it('should recalculate total pages correctly', async () => {
    const responseWithDifferentCount: ApiResponse<Hero> = {
      ...mockApiResponse,
      count: 25,
    };

    vi.mocked(heroesApi.getHeroes).mockResolvedValue(
      responseWithDifferentCount
    );

    const { result } = renderHook(() => useFetchHeroes(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalPages).toBe(3); // Math.ceil(25 / 10)
  });

  it('should refetch when currentPage changes', async () => {
    vi.mocked(heroesApi.getHeroes).mockResolvedValue(mockApiResponse);

    const { result, rerender } = renderHook(
      ({ page }) => useFetchHeroes(page),
      {
        initialProps: { page: 1 },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(heroesApi.getHeroes).toHaveBeenCalledWith(1);
    expect(heroesApi.getHeroes).toHaveBeenCalledTimes(1);

    // Change page
    rerender({ page: 2 });

    // Should be loading again
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(heroesApi.getHeroes).toHaveBeenCalledWith(2);
    expect(heroesApi.getHeroes).toHaveBeenCalledTimes(2);
  });

  it('should handle empty results', async () => {
    const emptyResponse: ApiResponse<Hero> = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    vi.mocked(heroesApi.getHeroes).mockResolvedValue(emptyResponse);

    const { result } = renderHook(() => useFetchHeroes(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.heroes).toEqual([]);
    expect(result.current.totalPages).toBe(0); // Math.ceil(0 / 10) = 0
    expect(result.current.error).toBeNull();
  });
});

