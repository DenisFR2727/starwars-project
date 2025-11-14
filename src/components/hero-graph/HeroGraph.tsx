import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
} from "reactflow";
import { Link, useLocation } from "react-router";
import Loader from "../ui/loader";
import Error from "../ui/error";
import useBuildNodes from "../../hooks/useBuildNodes";
import useFetchDetailsHero from "../../hooks/useFetchDetailsHero";

import styles from "./hero-graph.module.scss";
import "reactflow/dist/style.css";

export default function HeroGraphDetails() {
  const { loading, error, graphData } = useFetchDetailsHero();
  const initialNodesAndEdges = useBuildNodes(graphData);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodesAndEdges.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialNodesAndEdges.edges
  );
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = params.get("page") || "1";

  // Оновлюємо вузли та ребра при зміні даних
  useEffect(() => {
    const heroIdFromNode = nodes[0]?.id?.replace("hero-", "");
    const currentHeroId = graphData.hero?.id?.toString();
    if (
      initialNodesAndEdges.nodes.length !== nodes.length ||
      initialNodesAndEdges.edges.length !== edges.length ||
      currentHeroId !== heroIdFromNode
    ) {
      setNodes(initialNodesAndEdges.nodes);
      setEdges(initialNodesAndEdges.edges);
    }
  }, [
    initialNodesAndEdges.nodes,
    initialNodesAndEdges.edges,
    nodes.length,
    edges.length,
    graphData.hero?.id,
    setNodes,
    setEdges,
    nodes,
  ]);

  // Обробник кліку на вузол - піднімає його наверх
  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              style: {
                ...n.style,
                zIndex: 1000,
              },
            };
          }
          const currentZIndex =
            typeof n.style?.zIndex === "number" ? n.style.zIndex : 1;
          return {
            ...n,
            style: {
              ...n.style,
              zIndex: currentZIndex > 100 ? currentZIndex : 1,
            },
          };
        })
      );
    },
    [setNodes]
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.hero_graph_container}>
        <div className={styles.error_message}>
          <Error />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!graphData.hero) {
    return <div>Hero not found</div>;
  }

  return (
    <div className={styles.hero_graph_container}>
      <div className={styles.hero_graph_header}>
        <h2>Detailed information about the hero: {graphData.hero.name}</h2>
        <Link to={`/?page=${page}`}>
          <span>Back page</span>
        </Link>
      </div>
      <div className={styles.hero_graph_wrapper}>
        {nodes.length > 0 && (
          <ReactFlow
            key={`${graphData.hero?.id}-${nodes.length}`}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            connectionMode={ConnectionMode.Loose}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            fitView
            fitViewOptions={{
              padding: 0.2,
              maxZoom: 1.5,
            }}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
