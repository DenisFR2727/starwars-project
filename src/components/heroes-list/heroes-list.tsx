import { useEffect, useState } from "react";
import type { Hero } from "../../api/types";
import { getHeroes } from "../../api/heroesApi";
import { handleApiError } from "../../utils/error";

export default function HeroesList() {
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

  return (
    <div>
      <ul>
        {heroes.map((hero) => (
          <li key={hero.name}>{hero.name}</li>
        ))}
      </ul>
    </div>
  );
}
