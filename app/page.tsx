"use client";
import { useState } from "react";
import SearchBar from "./components/search-bar";
import Card from "./components/card";
import { Pokemon } from "./types/pokemon";
import styles from "./page.module.css";

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async (pokemonName: string) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: Pokemon = await response.json();
      setPokemonData(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Pokemon not found. Please try again.");
      setPokemonData(null); // Clear previous data
    }
  };

  return (
    <div className={styles.container}>
      <SearchBar onSearch={(pokemonName) => search(pokemonName)} />
      {error && <div className={styles.errorMessage}>{error}</div>}
      {pokemonData && <Card pokemonData={pokemonData} />}
    </div>
  );
}
