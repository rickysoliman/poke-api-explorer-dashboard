"use client";

import { useState, useEffect } from "react";
import styles from "./list-view.module.css";

interface PokemonSummary {
  name: string;
  id: number;
  imageUrl: string;
}

interface ListViewProps {
  onSelect: (name: string) => void;
}

// Define the ID ranges for each generation
const GENERATIONS = [
  { name: "Gen 1", limit: 151, offset: 0 },
  { name: "Gen 2", limit: 100, offset: 151 },
  { name: "Gen 3", limit: 135, offset: 251 },
  { name: "Gen 4", limit: 107, offset: 386 },
  { name: "Gen 5", limit: 156, offset: 493 },
  { name: "Gen 6", limit: 72, offset: 649 },
  { name: "Gen 7", limit: 88, offset: 721 },
  { name: "Gen 8", limit: 96, offset: 809 },
  { name: "Gen 9", limit: 120, offset: 905 },
];

export default function ListView({ onSelect }: ListViewProps) {
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [page, setPage] = useState(1);
  const [genIndex, setGenIndex] = useState(0); // Default to Gen 1
  const [isLoading, setIsLoading] = useState(false);

  const PAGE_SIZE = 20;

  // Reset to page 1 whenever the generation changes
  const handleGenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenIndex(Number(e.target.value));
    setPage(1);
  };

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const currentGen = GENERATIONS[genIndex];

        // Calculate where this specific page starts relative to the Generation's start
        const pageOffset = (page - 1) * PAGE_SIZE;

        // The actual API offset is (Generation Start) + (Page Progress)
        const apiOffset = currentGen.offset + pageOffset;

        // Smart Limit: Don't fetch past the end of the generation
        // If we are near the end (e.g. needing 20 items but only 11 left in Gen 1), trim it.
        const remainingInGen = currentGen.limit - pageOffset;
        const fetchLimit = Math.min(PAGE_SIZE, remainingInGen);

        if (fetchLimit <= 0) {
          setPokemonList([]);
          return;
        }

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${fetchLimit}&offset=${apiOffset}`
        );
        const data = await response.json();

        const formattedData = data.results.map(
          (p: { name: string; url: string }) => {
            const parts = p.url.split("/");
            const id = parseInt(parts[parts.length - 2]);

            return {
              name: p.name,
              id: id,
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            };
          }
        );

        setPokemonList(formattedData);
      } catch (error) {
        console.error("Failed to fetch list", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [page, genIndex]);

  // Calculate total pages for the current generation for the "Next" button logic
  const totalPages = Math.ceil(GENERATIONS[genIndex].limit / PAGE_SIZE);

  return (
    <div className={styles.container}>
      {/* Controls Header */}
      <div className={styles.controls}>
        <label className={styles.label}>Select Generation:</label>
        <div className={styles.selectWrapper}>
          <select
            value={genIndex}
            onChange={handleGenChange}
            className={styles.select}
          >
            {GENERATIONS.map((gen, index) => (
              <option key={gen.name} value={index}>
                {gen.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {pokemonList.map((poke) => (
          <div
            key={poke.id}
            className={styles.card}
            onClick={() => onSelect(poke.name)}
          >
            <div className={styles.imageWrapper}>
              {!isLoading && (
                <img src={poke.imageUrl} alt={poke.name} loading="lazy" />
              )}
            </div>
            <div className={styles.info}>
              <span className={styles.id}>
                #{String(poke.id).padStart(3, "0")}
              </span>
              <h3 className={styles.name}>{poke.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
          className={styles.pageBtn}
        >
          &larr; Prev
        </button>

        <span className={styles.pageNumber}>
          {GENERATIONS[genIndex].name} &mdash; Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || isLoading}
          className={styles.pageBtn}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
