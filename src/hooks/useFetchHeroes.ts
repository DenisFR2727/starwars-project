import { useEffect, useState } from "react";
import { getHeroes } from "../api/heroesApi";
import { handleApiError } from "../utils/error";
import type { Hero } from "../api/types";

// custom useFetchHeroes hook to attract heroes to the state.
export default function useFetchHeroes(currentPage: number) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setLoading(true);

        const res = await getHeroes(Number(currentPage));

        setHeroes(res.results);
        setTotalPages(Math.ceil(res.count / 10));
      } catch (error: unknown) {
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, [currentPage]);

  return { heroes, loading, error, totalPages };
}
