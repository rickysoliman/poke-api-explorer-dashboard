"use client";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (pokemonName: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Enter Pokémon name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="text-input"
      />
      <button type="submit" className="submit-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
