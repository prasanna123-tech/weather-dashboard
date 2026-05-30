import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search city… e.g. Mumbai, London, Tokyo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button className="search-btn" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}
