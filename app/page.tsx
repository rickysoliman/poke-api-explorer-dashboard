"use client";
import { useState } from "react";
import SearchBar from "./components/search-bar";
import Card from "./components/card";
import { Pokemon } from "./types/pokemon";
import styles from "./page.module.css";

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [colorsA, setColorsA] = useState(["#ffffff", "#ffffff"]);
  const [colorsB, setColorsB] = useState(["#ffffff", "#ffffff"]);

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

  const search = async (name: string) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("x");
      const data: Pokemon = await response.json();

      const type = data.types[0].type.name;
      const newColors = typeGradients[type];

      if (bgIndex === 0) {
        setColorsB(newColors);
        setBgIndex(1);
      } else {
        setColorsA(newColors);
        setBgIndex(0);
      }

      setPokemonData(data);
      setError(null);
    } catch {
      setError("Pokemon not found. Please try again.");
      setPokemonData(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.bgLayer} ${bgIndex === 0 ? styles.visible : ""}`}
        style={{
          ["--start" as any]: colorsA[0],
          ["--end" as any]: colorsA[1],
        }}
      />
      <div
        className={`${styles.bgLayer} ${bgIndex === 1 ? styles.visible : ""}`}
        style={{
          ["--start" as any]: colorsB[0],
          ["--end" as any]: colorsB[1],
        }}
      />

      <div className={styles.content}>
        <SearchBar onSearch={search} />
        {error && <div className={styles.errorMessage}>{error}</div>}
        {pokemonData && <Card pokemonData={pokemonData} />}
      </div>
    </div>
  );
}
