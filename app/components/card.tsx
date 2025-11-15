import { Pokemon } from "../types/pokemon";
import styles from "./card.module.css";

interface CardProps {
  pokemonData: Pokemon;
}

export default function Card({ pokemonData }: CardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.name}>{pokemonData.name}</h2>
      <img
        className={styles.image}
        src={pokemonData.sprites.front_default || ""}
        alt={pokemonData.name}
      />
      <p className={styles.info}>Height: {`${pokemonData.height} dm`}</p>
      <p className={styles.info}>Weight: {`${pokemonData.weight} lbs`}</p>
    </div>
  );
}
