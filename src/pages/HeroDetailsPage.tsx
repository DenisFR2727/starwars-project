import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import HeroGraphDetails from "../components/hero-graph/HeroGraph";

export default function HeroDetailsPage() {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    if (!urlParams.get("page")) {
      const currentPath = window.location.pathname;
      navigate(`${currentPath}?page=1`, { replace: true });
    }
  }, [search, navigate]);

  return <HeroGraphDetails />;
}
