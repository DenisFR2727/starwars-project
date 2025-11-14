import { useMemo } from "react";
import type { Edge, Node } from "reactflow";
import type { Film, Hero, Starship } from "../api/types";

import styles from "../components/hero-graph/hero-graph.module.scss";

export interface GraphData {
  hero: Hero | null;
  films: Film[];
  starships: Starship[];
}

export default function useBuildNodes(graphData: GraphData) {
  const { nodes, edges } = useMemo(() => {
    if (!graphData.hero) {
      return { nodes: [], edges: [] };
    }

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Adaptive positioning depending on screen size
    const isMobile = window.innerWidth < 768;
    const centerX = isMobile ? 200 : 400;
    const centerY = isMobile ? 100 : 50;
    const filmRadius = isMobile ? 120 : 200;

    // The central node - the hero
    const heroNode: Node = {
      id: `hero-${graphData.hero.id}`,
      type: "default",
      position: { x: centerX, y: centerY },
      data: {
        label: (
          <div className={styles.node_content}>
            <div className={styles.node_title}>Hero</div>
            <div className={styles.node_name}>{graphData.hero.name}</div>
          </div>
        ),
      },
      style: {
        background: "#ffd700",
        color: "#000",
        border: "2px solid #ffed4e",
        borderRadius: "8px",
        padding: "10px",
        minWidth: "150px",
        fontWeight: "bold",
      },
    };

    newNodes.push(heroNode);

    // Movie trailers
    const filmNodes: Node[] = graphData.films.map((film, index) => {
      const angle = (index * 360) / graphData.films.length;
      const x = centerX + filmRadius * Math.cos((angle * Math.PI) / 180);
      const y =
        (isMobile ? 250 : 300) + filmRadius * Math.sin((angle * Math.PI) / 180);

      return {
        id: `film-${film.id}`,
        type: "default",
        position: { x, y },
        data: {
          label: (
            <div className={styles.node_content}>
              <div className={styles.node_title}>Film</div>
              <div className={styles.node_name}>{film.title}</div>
              <div className={styles.node_episode}>
                Episode {film.episode_id}
              </div>
            </div>
          ),
        },
        style: {
          background: "#4a90e2",
          color: "#fff",
          border: "2px solid #2e5c8a",
          borderRadius: "8px",
          padding: "10px",
          minWidth: "150px",
        },
      };
    });

    newNodes.push(...filmNodes);

    // Ribs from hero to movies
    const heroToFilmEdges: Edge[] = graphData.films.map((film) => ({
      id: `edge-hero-${graphData.hero!.id}-film-${film.id}`,
      source: `hero-${graphData.hero!.id}`,
      target: `film-${film.id}`,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#ffd700", strokeWidth: 2 },
      label: "Appears",
    }));

    newEdges.push(...heroToFilmEdges);

    // Collecting all the spaceships from movies
    const allStarshipIds = new Set<number>();
    graphData.films.forEach((film) => {
      film.starships.forEach((starshipId) => {
        // We check whether the hero traveled on this ship.
        if (graphData.hero!.starships.includes(starshipId)) {
          allStarshipIds.add(starshipId);
        }
      });
    });

    // We add the spaceships on which the hero traveled.
    graphData.hero!.starships.forEach((starshipId) => {
      allStarshipIds.add(starshipId);
    });

    // Spacecraft nodes
    const starshipNodes: Node[] = [];
    const nodeSpacing = isMobile ? 180 : 250; // Збільшена відстань між вузлами
    const starshipRadius = isMobile ? 150 : 250; // Збільшена відстань від фільмів

    // We create nodes for ships, grouping them by movie
    graphData.films.forEach((film, filmIndex) => {
      const filmStarships = graphData.starships.filter(
        (starship) =>
          film.starships.includes(starship.id) &&
          graphData.hero!.starships.includes(starship.id)
      );

      filmStarships.forEach((starship, starshipIndex) => {
        // Checking if the node already exists
        if (!starshipNodes.find((n) => n.id === `starship-${starship.id}`)) {
          const angle = (filmIndex * 360) / graphData.films.length;
          const baseX =
            centerX + filmRadius * Math.cos((angle * Math.PI) / 180);
          const baseY =
            (isMobile ? 250 : 300) +
            filmRadius * Math.sin((angle * Math.PI) / 180);

          // Покращене розташування з більшою відстанню
          const offsetX =
            (starshipIndex - (filmStarships.length - 1) / 2) * nodeSpacing;
          const offsetY = starshipRadius;

          const x = baseX + offsetX;
          const y = baseY + offsetY;

          const starshipNode: Node = {
            id: `starship-${starship.id}`,
            type: "default",
            position: { x, y },
            data: {
              label: (
                <div className={styles.node_content}>
                  <div className={styles.node_title}>Spaceship</div>
                  <div className={styles.node_name}>{starship.name}</div>
                  <div className={styles.node_model}>{starship.model}</div>
                </div>
              ),
            },
            style: {
              background: "#9b59b6",
              color: "#fff",
              border: "2px solid #7d3c98",
              borderRadius: "8px",
              padding: "10px",
              minWidth: "150px",
            },
          };

          starshipNodes.push(starshipNode);
        }
      });
    });

    newNodes.push(...starshipNodes);

    // From movies to spaceships
    graphData.films.forEach((film) => {
      const filmStarships = graphData.starships.filter(
        (starship) =>
          film.starships.includes(starship.id) &&
          graphData.hero!.starships.includes(starship.id)
      );

      filmStarships.forEach((starship) => {
        const edge: Edge = {
          id: `edge-film-${film.id}-starship-${starship.id}`,
          source: `film-${film.id}`,
          target: `starship-${starship.id}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#4a90e2", strokeWidth: 2 },
          label: "Traveled",
        };
        newEdges.push(edge);
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [graphData]);

  return { nodes, edges };
}
