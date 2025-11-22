"use client";

import { useState, useEffect } from "react";
import styles from "./list-view.module.css";

interface PokemonSummary {
  name: string;
  id: number;
  imageUrl: string;
}

interface ListViewProps {
  // This prop allows the parent to know when a user clicks a pokemon
  onSelect: (name: string) => void;
}

export default function ListView({ onSelect }: ListViewProps) {
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const limit = 25;
        const offset = (page - 1) * limit;
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const data = await response.json();

        const formattedData = data.results.map(
          (p: { name: string; url: string }) => {
            // Extract ID from url (e.g. "https://pokeapi.co/api/v2/pokemon/25/")
            // Split by '/' gives ["...", "pokemon", "25", ""]
            // We take the second to last item
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
  }, [page]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {pokemonList.map((poke) => (
          <div
            key={poke.id}
            className={styles.card}
            onClick={() => onSelect(poke.name)} // Triggers search in parent
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

        <span className={styles.pageNumber}>Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={isLoading}
          className={styles.pageBtn}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
