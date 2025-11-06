import { useEffect, useState } from "react";
import { getHeroes } from "../api/heroesApi";
import { handleApiError } from "../utils/error";
import type { Hero } from "../api/types";

export default function useFetchHeroes() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setLoading(true);

        const res = await getHeroes();
        setHeroes(res.results);
      } catch (error: unknown) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  return { heroes, loading };
}
