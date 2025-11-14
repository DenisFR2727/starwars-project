import useFetchHeroes from "../../hooks/useFetchHeroes";
import HeroCard from "../card/card-heroes";
import Error from "../ui/error";
import Loader from "../ui/loader";
import Pagination from "../ui/pagination";

import styles from "./heroes-list.module.scss";
import { Link, useNavigate } from "react-router";

export default function HeroesList({ currentPage }: { currentPage: number }) {
  const navigate = useNavigate();
  const { loading, heroes, error, totalPages } = useFetchHeroes(currentPage);

  if (error) return <Error />;

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      navigate(`/?page=${nextPage}`);
    }
  };
  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      navigate(`/?page=${prevPage}`);
    }
  };

  return (
    <div>
      <div className={styles.heroes_list}>
        {heroes.map((hero) => (
          <Link key={hero.id} to={`/hero-id/${hero.id}?page=${currentPage}`}>
            <HeroCard hero={hero} />
          </Link>
        ))}
      </div>
      {loading && <Loader />}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    </div>
  );
}
