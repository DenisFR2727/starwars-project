import { Link } from "react-router";
import type { Hero } from "../../api/types";
import styles from "./card-heroes.module.scss";

interface HeroProps {
  hero: Hero;
}
export default function HeroCard({ hero }: HeroProps) {
  return (
    <Link to={`/hero-id/${hero.id}`}>
      <div className={styles.hero_card}>
        <img
          className={styles.hero_img}
          src="/dart_veider.jpg"
          alt="card_img"
          width={250}
          height={300}
        />
        <div className={styles.hero_id}>
          <span>{hero.id}</span>
        </div>
        <div className={styles.hero_name}>
          <p>{hero.name}</p>
        </div>
      </div>
    </Link>
  );
}
