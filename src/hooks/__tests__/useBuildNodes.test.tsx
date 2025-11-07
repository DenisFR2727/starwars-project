import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useBuildNodes from '../useBuildNodes';
import type { GraphData } from '../useBuildNodes';
import type { Hero, Film, Starship } from '../../api/types';

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

describe('useBuildNodes', () => {
  const mockHero: Hero = {
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
    films: [1, 2],
    species: [1],
    vehicles: [1, 2],
    starships: [1, 2],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://sw-api.starnavi.io/people/1/',
  };

  const mockFilm1: Film = {
    id: 1,
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl: 'It is a period of civil war...',
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1977-05-25',
    characters: [1, 2, 3],
    planets: [1, 2],
    starships: [1, 2],
    vehicles: [1, 2],
    species: [1, 2],
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
    url: 'https://sw-api.starnavi.io/films/1/',
  };

  const mockFilm2: Film = {
    id: 2,
    title: 'The Empire Strikes Back',
    episode_id: 5,
    opening_crawl: 'It is a dark time for the Rebellion...',
    director: 'Irvin Kershner',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1980-05-17',
    characters: [1, 2, 3],
    planets: [1, 2],
    starships: [1, 2, 3],
    vehicles: [1, 2],
    species: [1, 2],
    created: '2014-12-12T11:26:24.656000Z',
    edited: '2014-12-15T13:07:53.386000Z',
    url: 'https://sw-api.starnavi.io/films/2/',
  };

  const mockStarship1: Starship = {
    id: 1,
    name: 'X-wing',
    model: 'T-65 X-wing',
    manufacturer: 'Incom Corporation',
    cost_in_credits: '149999',
    length: '12.5',
    max_atmosphering_speed: '1050',
    crew: '1',
    passengers: '0',
    cargo_capacity: '110',
    consumables: '1 week',
    hyperdrive_rating: '1.0',
    MGLT: '100',
    starship_class: 'Starfighter',
    pilots: [1],
    films: [1, 2],
    created: '2014-12-12T11:19:05.340000Z',
    edited: '2014-12-20T21:23:49.886000Z',
    url: 'https://sw-api.starnavi.io/starships/1/',
  };

  const mockStarship2: Starship = {
    id: 2,
    name: 'Millennium Falcon',
    model: 'YT-1300 light freighter',
    manufacturer: 'Corellian Engineering Corporation',
    cost_in_credits: '100000',
    length: '34.37',
    max_atmosphering_speed: '1050',
    crew: '4',
    passengers: '6',
    cargo_capacity: '100000',
    consumables: '2 months',
    hyperdrive_rating: '0.5',
    MGLT: '75',
    starship_class: 'Light freighter',
    pilots: [1, 2],
    films: [1, 2],
    created: '2014-12-10T16:59:45.094000Z',
    edited: '2014-12-20T21:23:49.880000Z',
    url: 'https://sw-api.starnavi.io/starships/2/',
  };

  it('should return empty nodes and edges when hero is null', () => {
    const graphData: GraphData = {
      hero: null,
      films: [],
      starships: [],
    };

    const { result } = renderHook(() => useBuildNodes(graphData));

    expect(result.current.nodes).toEqual([]);
    expect(result.current.edges).toEqual([]);
  });

  it('should create hero node', () => {
    const graphData: GraphData = {
      hero: mockHero,
      films: [],
      starships: [],
    };

    const { result } = renderHook(() => useBuildNodes(graphData));

    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0].id).toBe('hero-1');
    expect(result.current.nodes[0].type).toBe('default');
    expect(result.current.nodes[0].position).toEqual({ x: 400, y: 50 });
    expect(result.current.nodes[0].style?.background).toBe('#ffd700');
  });

  it('should create film nodes', () => {
    const graphData: GraphData = {
      hero: mockHero,
      films: [mockFilm1, mockFilm2],
      starships: [],
    };

    const { result } = renderHook(() => useBuildNodes(graphData));

    // Should have 1 hero node + 2 film nodes = 3 nodes
    expect(result.current.nodes).toHaveLength(3);

    const filmNodes = result.current.nodes.filter((node) =>
      node.id.startsWith('film-')
    );
    expect(filmNodes).toHaveLength(2);
    expect(filmNodes[0].id).toBe('film-1');
    expect(filmNodes[1].id).toBe('film-2');
    expect(filmNodes[0].style?.background).toBe('#4a90e2');
  });

  it('should create edges from hero to films', () => {
    const graphData: GraphData = {
      hero: mockHero,
      films: [mockFilm1, mockFilm2],
      starships: [],
    };

    const { result } = renderHook(() => useBuildNodes(graphData));

    expect(result.current.edges).toHaveLength(2);
    expect(result.current.edges[0].source).toBe('hero-1');
    expect(result.current.edges[0].target).toBe('film-1');
    expect(result.current.edges[0].label).toBe('Appears');
    expect(result.current.edges[1].source).toBe('hero-1');
    expect(result.current.edges[1].target).toBe('film-2');
  });

  it('should create starship nodes', () => {
    const graphData: GraphData = {
      hero: mockHero,
      films: [mockFilm1],
      starships: [mockStarship1, mockStarship2],
    };

    const { result } = renderHook(() => useBuildNodes(graphData));

    // Should have 1 hero + 1 film + 2 starships = 4 nodes
    expect(result.current.nodes.length).toBeGreaterThanOrEqual(4);

    const starshipNodes = result.current.nodes.filter((node) =>
      node.id.startsWith('starship-')
    );
    expect(starshipNodes.length).toBeGreaterThanOrEqual(2);
    expect(starshipNodes[0].style?.background).toBe('#9b59b6');
  });

  it('should create edges from films to starships', () => {
    const graphData: GraphData = {
      hero: mockHero,
      films: [mockFilm1],
      starships: [mockStarship1, mockStarship2],
    };

    const { result } = renderHook(() => useBuildNodes(graphData));

    // Should have edges: hero->film (1) + film->starships (2) = 3 edges
    expect(result.current.edges.length).toBeGreaterThanOrEqual(3);

    const filmToStarshipEdges = result.current.edges.filter(
      (edge) =>
        edge.source.startsWith('film-') && edge.target.startsWith('starship-')
    );
    expect(filmToStarshipEdges.length).toBeGreaterThanOrEqual(2);
    expect(filmToStarshipEdges[0].label).toBe('Traveled');
  });

  it('should handle mobile screen size', () => {
    // Mock mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const graphData: GraphData = {
      hero: mockHero,
      films: [mockFilm1],
      starships: [],
    };

    const { result } = renderHook(() => useBuildNodes(graphData));

    // Hero node should have mobile positioning
    const heroNode = result.current.nodes.find((node) =>
      node.id.startsWith('hero-')
    );
    expect(heroNode?.position).toEqual({ x: 200, y: 100 });

    // Reset to desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('should only include starships that hero traveled on', () => {
    // Create a starship that hero didn't travel on
    const starshipNotTraveled: Starship = {
      ...mockStarship1,
      id: 99,
      pilots: [2], // Different pilot
    };

    const graphData: GraphData = {
      hero: mockHero,
      films: [mockFilm1],
      starships: [mockStarship1, starshipNotTraveled],
    };

    const { result } = renderHook(() => useBuildNodes(graphData));

    const starshipNodes = result.current.nodes.filter((node) =>
      node.id.startsWith('starship-')
    );

    // Should only include starship 1, not 99
    const starshipIds = starshipNodes.map((node) => node.id);
    expect(starshipIds).toContain('starship-1');
    expect(starshipIds).not.toContain('starship-99');
  });

  it('should recalculate nodes when graphData changes', () => {
    const graphData1: GraphData = {
      hero: mockHero,
      films: [mockFilm1],
      starships: [],
    };

    const { result, rerender } = renderHook(
      ({ data }) => useBuildNodes(data),
      {
        initialProps: { data: graphData1 },
      }
    );

    const initialNodesCount = result.current.nodes.length;

    const graphData2: GraphData = {
      hero: mockHero,
      films: [mockFilm1, mockFilm2],
      starships: [],
    };

    rerender({ data: graphData2 });

    // Should have more nodes now (additional film node)
    expect(result.current.nodes.length).toBeGreaterThan(initialNodesCount);
    expect(result.current.nodes.length).toBe(3); // 1 hero + 2 films
  });
});

