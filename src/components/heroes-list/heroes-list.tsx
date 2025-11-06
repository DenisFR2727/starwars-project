import useFetchHeroes from "../../hooks/useFetchHeroes";
import HeroCard from "../card/card-heroes";
import Error from "../ui/error";
import Loader from "../ui/loader";

import styles from "./heroes-list.module.scss";

export default function HeroesList() {
  const { loading, heroes, error } = useFetchHeroes();

  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className={styles.heroes_list}>
      {heroes.map((hero) => (
        <HeroCard key={hero.id} hero={hero} />
      ))}
    </div>
  );
}
