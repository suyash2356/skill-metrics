// components/SearchResults.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { fetchSearchSuggestions, fetchRecommendations, Suggestion, Recommendation } from "@/api/searchAPI";
import { Search, Star, Users, Layers, Book, Globe, Youtube, Brain } from "lucide-react";

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ------------------------------
  // 🔹 Fetch Suggestions
  // ------------------------------
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      const res = await fetchSearchSuggestions(query);
      setSuggestions(res);
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  // ------------------------------
  // 🔹 Fetch Recommendations when a skill is selected
  // ------------------------------
  async function handleSelectSuggestion(s: Suggestion) {
    setQuery(s.name || "");
    setSuggestions([]);
    if (s.kind === "skill") {
      const res = await fetchRecommendations(s.name);
      setRecommendations(res);
    } else {
      setRecommendations([]);
    }
  }

  // ------------------------------
  // 🔹 Keyboard Navigation
  // ------------------------------
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    }
  }

  // ------------------------------
  // 🔹 Handle Outside Click
  // ------------------------------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------------------
  // 🔹 Render Icon per suggestion type
  // ------------------------------
  function renderIcon(s: Suggestion) {
    if (s.kind === "user") return <Users className="w-4 h-4 text-blue-400" />;
    if (s.kind === "community") return <Layers className="w-4 h-4 text-green-400" />;
    return <Brain className="w-4 h-4 text-purple-400" />;
  }

  // ------------------------------
  // 🔹 Render Recommendation Icon
  // ------------------------------
  function recommendationIcon(type: Recommendation["type"]) {
    switch (type) {
      case "book": return <Book className="w-4 h-4 text-yellow-400" />;
      case "course": return <Layers className="w-4 h-4 text-blue-400" />;
      case "youtube": return <Youtube className="w-4 h-4 text-red-500" />;
      case "website": return <Globe className="w-4 h-4 text-teal-400" />;
      default: return <Book className="w-4 h-4 text-gray-400" />;
    }
  }

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto mt-10">
      {/* Search Bar */}
      <div
        className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 border ${
          isFocused ? "border-blue-500 bg-gray-900 shadow-lg" : "border-gray-700 bg-gray-800"
        }`}
      >
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search for profiles, skills, or communities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
          {suggestions.map((s, i) => (
            <button
              key={`${s.kind}-${i}`}
              onClick={() => handleSelectSuggestion(s)}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors ${
                activeIndex === i ? "bg-gray-800" : ""
              }`}
            >
              {renderIcon(s)}
              <span className="ml-3 text-gray-200 text-sm font-medium">
                {s.name}
              </span>
              <span className="ml-auto text-xs text-gray-500 capitalize">{s.kind}</span>
            </button>
          ))}
        </div>
      )}

      {/* Recommendations Display */}
      {recommendations.length > 0 && (
        <div className="mt-6 bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" /> Recommended Resources
          </h2>
          <div className="space-y-4">
            {recommendations.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-800 hover:bg-gray-750 transition-all rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  {recommendationIcon(r.type)}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-100">{r.title}</h3>
                    {r.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{r.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      {r.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" /> {r.rating.toFixed(1)}
                        </span>
                      )}
                      {r.views && <span>{r.views}</span>}
                      {r.isPaid !== undefined && (
                        <span
                          className={`${
                            r.isPaid ? "text-red-400" : "text-green-400"
                          } font-medium`}
                        >
                          {r.isPaid ? "Paid" : "Free"}
                        </span>
                      )}
                      {r.difficulty && (
                        <span className="capitalize text-gray-400">{r.difficulty}</span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
