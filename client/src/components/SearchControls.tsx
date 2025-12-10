"use client";

import { useState } from "react";
import { runSearch } from "../lib/api/client";
import { SearchPerformanceDTO } from "../lib/api/types";
import { useAuth } from "./context/appContext";

const ALGORITHMS = ["Basic", "KMP", "Rabin-Karp", "Boyer-Moore", "Fuzzy"];

interface SearchControlsProps {
  documentsCount: number;
  onSearchComplete: (results: SearchPerformanceDTO[]) => void;
}

export default function SearchControls({
  documentsCount,
  onSearchComplete,
}: SearchControlsProps) {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([
    "Basic",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAlgorithm = (algorithm: string) => {
    setSelectedAlgorithms((prev) =>
      prev.includes(algorithm)
        ? prev.filter((a) => a !== algorithm)
        : [...prev, algorithm]
    );
  };

  const isSubmitDisabled =
    documentsCount === 0 ||
    searchTerm.trim() === "" ||
    selectedAlgorithms.length === 0 ||
    isLoading;

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await runSearch(searchTerm, caseSensitive, token ?? undefined);
      
      const filteredResults = results.filter((result) =>
        selectedAlgorithms.includes(result.algorithmName)
      );

      onSearchComplete(filteredResults);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to perform search. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSearch();
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
          <p className="text-red-200 text-sm mb-3">{error}</p>
          <button
            onClick={handleRetry}
            className="text-red-300 hover:text-red-100 text-sm font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      <div>
        <label
          htmlFor="search-term"
          className="block text-gray-300 text-sm font-medium mb-2"
        >
          Search Term
        </label>
        <input
          id="search-term"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center">
        <input
          id="case-sensitive"
          type="checkbox"
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
          className="w-4 h-4 text-violet-600 bg-gray-800 border-gray-600 rounded focus:ring-violet-500 focus:ring-2"
          disabled={isLoading}
        />
        <label htmlFor="case-sensitive" className="ml-2 text-gray-300 text-sm">
          Case sensitive
        </label>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-3">
          Select Algorithms
        </label>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((algorithm) => {
            const isSelected = selectedAlgorithms.includes(algorithm);
            return (
              <button
                key={algorithm}
                onClick={() => toggleAlgorithm(algorithm)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-violet-600 text-white border-2 border-violet-500"
                    : "bg-gray-800 bg-opacity-50 text-gray-300 border-2 border-gray-600 hover:border-gray-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSelected && (
                  <span className="inline-block mr-1">✓</span>
                )}
                {algorithm}
              </button>
            );
          })}
        </div>
        {selectedAlgorithms.length === 0 && (
          <p className="text-red-400 text-xs mt-2">
            Please select at least one algorithm
          </p>
        )}
      </div>

      <button
        onClick={handleSearch}
        disabled={isSubmitDisabled}
        className="w-full bg-violet-700 hover:bg-violet-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Searching...
          </>
        ) : (
          "Run Search"
        )}
      </button>

      {documentsCount === 0 && (
        <p className="text-yellow-400 text-xs text-center">
          Please upload at least one document before searching
        </p>
      )}
    </div>
  );
}
