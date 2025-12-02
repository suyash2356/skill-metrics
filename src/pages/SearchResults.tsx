// components/SearchResults.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { fetchSearchSuggestions, fetchPeopleCommunitySuggestions, fetchExploreSuggestions, fetchRecommendations, Suggestion, Recommendation } from "@/api/searchAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Star, Users, Layers, Book, Globe, Youtube, Brain } from "lucide-react";

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ------------------------------
  // 🔹 Fetch Suggestions
  // ------------------------------
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const scope = params.get('scope') || 'people';
  // initialize query from URL param so user doesn't need to retype
  useEffect(() => {
    const q = params.get('q') || '';
    setQuery(q);
  // run once on mount or when location.search changes
  }, [location.search]);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        let res: Suggestion[] = [];
        if (scope === 'explore') {
          res = await fetchExploreSuggestions(query);
        } else {
          res = await fetchPeopleCommunitySuggestions(query);
        }
        setSuggestions(res);
      } catch (e) {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [query, scope]);

  // ------------------------------
  // 🔹 Fetch Recommendations when a skill is selected
  // ------------------------------
  async function handleSelectSuggestion(s: Suggestion) {
    setQuery(s.name || "");
    setSuggestions([]);
    // If the selected suggestion is a skill, navigate to the skill recommendations page
    if (s.kind === 'skill') {
      navigate(`/skills/${encodeURIComponent(s.name)}`);
      return;
    }

    // If it's an explore item (certification/category/path), open the search results scoped to explore
    if (s.kind === 'explore') {
      navigate(`/search?q=${encodeURIComponent(s.name)}&scope=explore`);
      return;
    }

    // user
    if (s.kind === 'user') {
      navigate(`/profile/${s.id}`);
      return;
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
    if (s.kind === "skill") return <Brain className="w-4 h-4 text-purple-400" />;
    return <Layers className="w-4 h-4 text-green-400" />;
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

      {/* Recommendations are shown on the dedicated skill page. SearchResults now only handles suggestions and navigation. */}
    </div>
  );
}
