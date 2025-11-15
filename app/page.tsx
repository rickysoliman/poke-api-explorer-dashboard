"use client";
import { useState } from "react";
import SearchBar from "./components/search-bar";
import { Pokemon } from "./types/pokemon";

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
    <>
      <SearchBar onSearch={(pokemonName) => search(pokemonName)} />
      {error && <div className="error-message">{error}</div>}
      {pokemonData && (
        <div>
          <h2>{pokemonData.name}</h2>
          <img
            src={pokemonData.sprites.front_default || ""}
            alt={pokemonData.name}
          />
          <p>Height: {pokemonData.height}</p>
          <p>Weight: {pokemonData.weight}</p>
        </div>
      )}
    </>
  );
}
