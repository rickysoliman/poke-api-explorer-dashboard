import { useState, ReactNode, useCallback } from "react";
import { Pokemon, SpeciesData } from "../types/pokemon";
import styles from "./card.module.css";
import SpeciesModal from "./species-modal";

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
  // State for the Species Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [speciesData, setSpeciesData] = useState<SpeciesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [speciesError, setSpeciesError] = useState<string | null>(null);

  // Clear data when new Pokemon is loaded (optional but good for a fresh start)
  useState(() => {
    setSpeciesData(null);
    setSpeciesError(null);
  });

  const fetchSpeciesData = useCallback(
    async (url: string) => {
      // Only proceed if not already loading and data is not present
      if (isLoading || speciesData) return;

      setIsLoading(true);
      setSpeciesError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch species data.");
        const data = await response.json();

        // Find the English Pokedex Entry (Flavor Text)
        const englishEntry = data.flavor_text_entries.find(
          (entry: any) => entry.language.name === "en"
        );
        // Clean up newlines and form feeds from the text
        const pokedexEntry = englishEntry
          ? englishEntry.flavor_text.replace(/[\n\f]/g, " ")
          : "No English Pokedex entry found.";

        // Find the English Genus (Category, e.g., "Seed Pokémon")
        const englishGenus = data.genera.find(
          (genus: any) => genus.language.name === "en"
        );
        const genus = englishGenus ? englishGenus.genus : "N/A";

        // Get the Pokémon's official color
        const color = data.color ? data.color.name : "N/A";

        setSpeciesData({ pokedexEntry, genus, color });
      } catch (error) {
        console.error("Species fetch error:", error);
        setSpeciesError("Could not load Pokedex details.");
      } finally {
        setIsLoading(false);
      }
    },
    [speciesData, isLoading]
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Fetch only if we haven't already fetched the data
    if (!speciesData && !isLoading) {
      fetchSpeciesData(pokemonData.species.url);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
    <>
      <div className={styles.wrapper}>
        <div className={styles.artworkContainer}>
          <img
            className={styles.artwork}
            src={artwork}
            alt={pokemonData.name}
          />
        </div>

        <div className={styles.card}>
          <h2 className={styles.name}>{pokemonData.name}</h2>

          <img className={styles.sprite} src={sprite} alt={pokemonData.name} />

          <AccordionSection title="General Information" defaultOpen={true}>
            <p className={styles.info}>ID: {pokemonData.id}</p>
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

          <button className={styles.speciesButton} onClick={handleOpenModal}>
            View Pokedex Entry & Details
          </button>
        </div>
      </div>

      {isModalOpen && (
        <SpeciesModal
          pokemonName={pokemonData.name}
          speciesData={speciesData}
          isLoading={isLoading}
          speciesError={speciesError}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
