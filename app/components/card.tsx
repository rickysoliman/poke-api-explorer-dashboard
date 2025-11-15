import { Pokemon } from "../types/pokemon";
import styles from "./card.module.css";

const dmToFeetInches = (dm: number) => {
  const inchesTotal = dm * 3.93701;
  const feet = Math.floor(inchesTotal / 12);
  const inches = Math.round(inchesTotal % 12);
  return `${feet}' ${inches}"`;
};

const hgToLbs = (hg: number) => {
  const lbs = hg * 0.220462;
  return `${lbs.toFixed(1)} lbs`;
};

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
      <p className={styles.info}>
        Height: {dmToFeetInches(pokemonData.height)}
      </p>
      <p className={styles.info}>Weight: {hgToLbs(pokemonData.weight)}</p>
    </div>
  );
}
