"use client";
import { useState } from "react";
import SearchBar from "./components/search-bar";
import PokemonDataView from "./components/pokemon-data-view";
import { Pokemon } from "./types/pokemon";
import styles from "./page.module.css";

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [colorsA, setColorsA] = useState(["#ffffff", "#ffffff", "#ffffff"]);
  const [colorsB, setColorsB] = useState(["#ffffff", "#ffffff", "#ffffff"]);

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

  const formatPokemonName = (name: string): string => {
    let cleanName = name.toLowerCase().trim();

    // 1. Handle Gender Symbols
    if (cleanName.includes("♀")) cleanName = cleanName.replace(/♀/g, "-f");
    if (cleanName.includes("♂")) cleanName = cleanName.replace(/♂/g, "-m");

    // 2. Remove Special Characters (dots, apostrophes)
    // Mr. Mime -> mr mime | Farfetch'd -> farfetchd
    cleanName = cleanName.replace(/[.'`]/g, "");

    // 3. Split into words to handle prefixes
    // "Mega Charizard X" -> ["mega", "charizard", "x"]
    let parts = cleanName.split(/[\s-]+/);

    // 4. Define Prefix Mappings (User Input -> API Suffix)
    const prefixMap: Record<string, string> = {
      alolan: "alola",
      galarian: "galar",
      hisuian: "hisui",
      paldean: "paldea",
      gigantamax: "gmax",
      mega: "mega",
      primal: "primal",
    };

    // 5. Check if the first word is a known prefix
    if (parts.length > 1 && prefixMap[parts[0]]) {
      const originalPrefix = parts.shift()!; // Remove "mega" or "alolan"
      const apiSuffix = prefixMap[originalPrefix];

      // Handle Special Case: Mega X/Y (e.g., Mega Charizard X)
      // If we have 2 parts left (["charizard", "x"]), we need to inject "mega" in the middle
      if (
        originalPrefix === "mega" &&
        parts.length === 2 &&
        (parts[1] === "x" || parts[1] === "y")
      ) {
        // Result: charizard-mega-x
        parts.splice(1, 0, apiSuffix);
      } else {
        // Standard Case: Alolan Raichu -> raichu-alola
        parts.push(apiSuffix);
      }
    }

    // 6. Rejoin with dashes
    return parts.join("-");
  };

  const search = async (name: string) => {
    const cleanName = formatPokemonName(name);
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${cleanName}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("x");
      const data: Pokemon = await response.json();

      const type1 = data.types[0].type.name;
      const type2 = data.types[1]?.type.name;

      const type1Colors = typeGradients[type1];

      let newColors = [...type1Colors, type1Colors[1]];

      if (type2) {
        const type2Colors = typeGradients[type2];
        newColors = [type1Colors[0], type1Colors[1], type2Colors[1]];
      }

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
          ["--end-1" as any]: colorsA[1],
          ["--end-2" as any]: colorsA[2],
        }}
      />
      <div
        className={`${styles.bgLayer} ${bgIndex === 1 ? styles.visible : ""}`}
        style={{
          ["--start" as any]: colorsB[0],
          ["--end-1" as any]: colorsB[1],
          ["--end-2" as any]: colorsB[2],
        }}
      />

      <div className={styles.content}>
        <SearchBar onSearch={search} />
        {error && <div className={styles.errorMessage}>{error}</div>}
        {pokemonData && (
          <PokemonDataView key={pokemonData.id} pokemonData={pokemonData} />
        )}
      </div>
    </div>
  );
}
