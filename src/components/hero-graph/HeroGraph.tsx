import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
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
  const { nodes, edges } = useBuildNodes(graphData);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = params.get("page") || "1";

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
            connectionMode={ConnectionMode.Loose}
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
