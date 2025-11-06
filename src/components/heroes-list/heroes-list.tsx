import useFetchHeroes from "../../hooks/useFetchHeroes";
import Error from "../ui/error";
import Loader from "../ui/loader";

export default function HeroesList() {
  const { loading, heroes, error } = useFetchHeroes();

  if (loading) return <Loader />;
  if (error) return <Error />;

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
