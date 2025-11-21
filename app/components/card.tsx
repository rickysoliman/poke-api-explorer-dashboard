import { useState, ReactNode } from "react";
import { Pokemon } from "../types/pokemon";
import styles from "./card.module.css";

interface AccordionSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const AccordionSection = ({
  title,
  children,
  defaultOpen = false,
}: AccordionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <h3 className={styles.subheading} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.indicator}>{isOpen ? "▼" : "►"}</span>
        {title}
      </h3>

      <div
        className={`${styles.content} ${
          isOpen ? styles.contentOpen : styles.contentClosed
        }`}
      >
        {children}
      </div>
    </div>
  );
};

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
  const artwork =
    pokemonData.sprites.other["official-artwork"].front_default ||
    pokemonData.sprites.front_default ||
    "";

  const sprite =
    pokemonData.sprites.front_default ||
    pokemonData.sprites.other.showdown.front_default ||
    "";

  const types = pokemonData.types.map((t) => t.type.name).join(", ");
  const abilities = pokemonData.abilities
    .map((a) => (a.is_hidden ? `${a.ability.name} (hidden)` : a.ability.name))
    .join(", ");

  const stats = pokemonData.stats.map((s) => ({
    name: s.stat.name,
    value: s.base_stat,
  }));

  const moves = pokemonData.moves.slice(0, 5).map((m) => m.move.name);

  return (
    <div className={styles.wrapper}>
      <div className={styles.artworkContainer}>
        <img className={styles.artwork} src={artwork} alt={pokemonData.name} />
      </div>

      <div className={styles.card}>
        <h2 className={styles.name}>{pokemonData.name}</h2>

        <img className={styles.sprite} src={sprite} alt={pokemonData.name} />

        <AccordionSection title="General Information">
          <p className={styles.info}>ID: {pokemonData.order}</p>
          <p className={styles.info}>Types: {types}</p>
          <p className={styles.info}>
            Base Experience: {pokemonData.base_experience}
          </p>
          <p className={styles.info}>
            Height: {dmToFeetInches(pokemonData.height)}
          </p>
          <p className={styles.info}>Weight: {hgToLbs(pokemonData.weight)}</p>
          <p className={styles.info}>Abilities: {abilities}</p>
        </AccordionSection>

        <AccordionSection title="Stats">
          <ul className={styles.list}>
            {stats.map((s) => (
              <li key={s.name}>
                {s.name}: {s.value}
              </li>
            ))}
          </ul>
        </AccordionSection>

        <AccordionSection title="Moves">
          <ul className={styles.list}>
            {moves.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </AccordionSection>

        <button className={styles.speciesButton}>Get Species Data</button>
      </div>
    </div>
  );
}
