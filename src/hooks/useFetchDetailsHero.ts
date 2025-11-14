import { useEffect, useState } from "react";
import { handleApiError } from "../utils/error";
import {
  getFilmsByIds,
  getHeroById,
  getStarshipsByIds,
} from "../api/heroesApi";
import type { GraphData } from "./useBuildNodes";
import { useParams } from "react-router";

export default function useFetchDetailsHero() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    hero: null,
    films: [],
    starships: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("ID hero not specified");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const heroId = parseInt(id, 10);
        const hero = await getHeroById(heroId);

        // Load films and starships in parallel after getting hero
        // This reduces total loading time while respecting rate limits
        const [films, starships] = await Promise.all([
          hero.films.length > 0 ? getFilmsByIds(hero.films) : Promise.resolve([]),
          hero.starships.length > 0
            ? getStarshipsByIds(hero.starships)
            : Promise.resolve([]),
        ]);

        const data: GraphData = {
          hero,
          films,
          starships,
        };

        setGraphData(data);
      } catch (err: unknown) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { loading, error, graphData };
}
