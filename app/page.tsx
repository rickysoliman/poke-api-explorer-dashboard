"use client";
import { useState } from "react";
import SearchBar from "./components/search-bar";
import Card from "./components/card";
import { Pokemon } from "./types/pokemon";
import styles from "./page.module.css";

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);

  const typeGradients: Record<string, string[]> = {
    grass: ["#eefdf0", "#b8e89c"],
    fire: ["#ffe9e3", "#ff9d6e"],
    water: ["#eef6ff", "#6fb2ff"],
    electric: ["#fffbe0", "#ffe86b"],
    psychic: ["#ffeafd", "#e26bff"],
    ice: ["#f2fcff", "#7fdcff"],
    dragon: ["#f4edff", "#b08aff"],
    dark: ["#f0f0f0", "#8c8c8c"],
    fairy: ["#fff2fa", "#ff9ed7"],
    poison: ["#f7e7ff", "#c076ff"],
    bug: ["#f7ffe8", "#c4e65c"],
    rock: ["#faf2e5", "#d4b07b"],
    flying: ["#f5f8ff", "#9ab8ff"],
    ground: ["#fff4e3", "#e3b476"],
    steel: ["#f5f5f5", "#b5c1d1"],
    ghost: ["#f6eaff", "#a784ff"],
    fighting: ["#ffecec", "#e46b6b"],
    normal: ["#fafafa", "#cfcfcf"],
  };

  const getBackground = () => {
    if (!pokemonData) return styles.container;

    const primaryType = pokemonData.types?.[0]?.type?.name;
    const colors = typeGradients[primaryType];

    if (!colors) return styles.container;

    return `${styles.container} ${styles.dynamicBackground}`;
  };

  const search = async (pokemonName: string) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data: Pokemon = await response.json();
      setPokemonData(data);
      setError(null);
    } catch {
      setError("Pokemon not found. Please try again.");
      setPokemonData(null);
    }
  };

  return (
    <div
      className={getBackground()}
      style={
        pokemonData
          ? {
              background: `linear-gradient(180deg, ${
                typeGradients[pokemonData.types[0].type.name][0]
              } 0%, ${typeGradients[pokemonData.types[0].type.name][1]} 70%)`,
            }
          : {}
      }
    >
      <SearchBar onSearch={(pokemonName) => search(pokemonName)} />
      {error && <div className={styles.errorMessage}>{error}</div>}
      {pokemonData && <Card pokemonData={pokemonData} />}
    </div>
  );
}
