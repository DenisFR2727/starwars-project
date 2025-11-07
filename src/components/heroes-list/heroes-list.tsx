import { useState } from "react";
import useFetchHeroes from "../../hooks/useFetchHeroes";
import HeroCard from "../card/card-heroes";
import Error from "../ui/error";
import Loader from "../ui/loader";
import Pagination from "../ui/pagination";

import styles from "./heroes-list.module.scss";

export default function HeroesList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { loading, heroes, error, totalPages } = useFetchHeroes(currentPage);

  if (loading) return <Loader />;
  if (error) return <Error />;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      <div className={styles.heroes_list}>
        {heroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    </div>
  );
}
