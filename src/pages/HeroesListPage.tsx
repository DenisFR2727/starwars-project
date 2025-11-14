import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import HeroesList from "../components/heroes-list/heroes-list";

export default function HeroesListPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  const page = Number(params.get("page") || 1);

  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    if (!urlParams.get("page")) {
      navigate(`/?page=1`, { replace: true });
    }
  }, [search, navigate]);

  return <HeroesList currentPage={page} />;
}
