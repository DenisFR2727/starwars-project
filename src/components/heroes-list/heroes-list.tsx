import { useEffect, useState } from "react";
import type { Hero } from "../../api/types";

export default function HeroesList() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {}, []);

  return <div></div>;
}
