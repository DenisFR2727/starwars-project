import useFetchHeroes from "../../hooks/useFetchHeroes";
import Loader from "../ui/loader";

export default function HeroesList() {
  const { loading, heroes } = useFetchHeroes();

  if (loading) return <Loader />;

  return (
    <div>
      <ul>
        {heroes.map((hero) => (
          <li key={hero.name}>{hero.name}</li>
        ))}
      </ul>
    </div>
  );
}
