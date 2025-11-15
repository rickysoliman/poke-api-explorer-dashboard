"use client";
import React, { useState } from "react";
import styles from "./search-bar.module.css";

interface SearchBarProps {
  onSearch: (pokemonName: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setInput("");
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearch}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search for a Pokémon..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className={styles.button} type="submit">
        Search
      </button>
    </form>
  );
}
