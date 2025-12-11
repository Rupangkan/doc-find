"use client";

import { useState, useEffect } from "react";
import { SearchPerformanceDTO } from "../lib/api/types";

interface ResultsComparisonPanelProps {
  results: SearchPerformanceDTO[];
}

export default function ResultsComparisonPanel({
  results,
}: ResultsComparisonPanelProps) {
  const [expandedAlgorithm, setExpandedAlgorithm] = useState<string | null>(null);
  // we only need the setter to respond to resize; avoid unused variable lint
  const [, setIsMobileView] = useState(false);

  // Map server-side algorithm class names to friendly labels for display
  const ALGORITHM_LABELS: { id: string; label: string }[] = [
    { id: "BasicSearchAlgorithm", label: "Basic" },
    { id: "KnuthMorrisPrattAlgorithm", label: "KMP" },
    { id: "RabinKarpAlgorithm", label: "Rabin-Karp" },
    { id: "BoyerMooreAlgorithm", label: "Boyer-Moore" },
    { id: "FuzzySearchAlgorithm", label: "Fuzzy" },
  ];

  const getFriendlyLabel = (algorithmName: string) => {
    const found = ALGORITHM_LABELS.find((a) => a.id === algorithmName);
    return found ? found.label : algorithmName;
  };

  // Detect if we should show mobile view (for responsive behavior)
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    // run once to set initial
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (results.length === 0) {
    return (
      <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-center">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-gray-300 mb-2">No search results available</p>
        <p className="text-gray-400 text-sm">
          Run a search to compare algorithm performance
        </p>
      </div>
    );
  }

  // Calculate statistics
  const fastestResult = results.reduce((prev, current) =>
    prev.executionTime < current.executionTime ? prev : current
  );

  const slowestResult = results.reduce((prev, current) =>
    prev.executionTime > current.executionTime ? prev : current
  );

  const totalMatches = results.reduce(
    (sum, result) =>
      sum +
      result.searchResultDTO.reduce((acc, doc) => acc + doc.occurrences.length, 0),
    0
  );

  const allFound = results.every((r) => r.isFound);

  // Calculate max execution time for bar visualization scaling
  const maxExecutionTime = slowestResult.executionTime;

  return (
    <div className="w-full space-y-6">
      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fastest Algorithm Tile */}
        <div className="p-4 bg-gradient-to-br from-green-900 to-green-800 bg-opacity-50 rounded-lg border border-green-700 shadow-lg">
          <p className="text-green-300 text-xs uppercase tracking-wider font-semibold mb-2">
            Fastest Algorithm
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-green-100 mb-2">
            {fastestResult.algorithmName}
          </h3>
          <p className="text-green-200 text-sm md:text-base font-mono">
            {fastestResult.executionTime.toFixed(4)} ms
          </p>
        </div>

        {/* Slowest Algorithm Tile */}
        <div className="p-4 bg-gradient-to-br from-orange-900 to-orange-800 bg-opacity-50 rounded-lg border border-orange-700 shadow-lg">
          <p className="text-orange-300 text-xs uppercase tracking-wider font-semibold mb-2">
            Slowest Algorithm
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-orange-100 mb-2">
            {slowestResult.algorithmName}
          </h3>
          <p className="text-orange-200 text-sm md:text-base font-mono">
            {slowestResult.executionTime.toFixed(4)} ms
          </p>
        </div>

        {/* Match Status Tile */}
        <div className="p-4 bg-gradient-to-br from-blue-900 to-blue-800 bg-opacity-50 rounded-lg border border-blue-700 shadow-lg">
          <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-2">
            Match Status
          </p>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                allFound ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <h3 className="text-lg md:text-xl font-bold text-blue-100">
              {allFound ? "Match Found" : "No Match"}
            </h3>
          </div>
        </div>

        {/* Total Matches Tile */}
        <div className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 bg-opacity-50 rounded-lg border border-purple-700 shadow-lg">
          <p className="text-purple-300 text-xs uppercase tracking-wider font-semibold mb-2">
            Total Matches
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-purple-100">
            {totalMatches}
          </h3>
          <p className="text-purple-200 text-xs mt-1">
            across all algorithms
          </p>
        </div>
      </div>

      {/* Responsive Table/Grid Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Algorithm Comparison
        </h3>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 bg-opacity-50 border-b border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Algorithm
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Execution Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Visualization
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Match Count
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const matchCount = result.searchResultDTO.reduce(
                  (acc, doc) => acc + doc.occurrences.length,
                  0
                );
                const barWidth =
                  (result.executionTime / maxExecutionTime) * 100;
                const isFastest =
                  result.executionTime === fastestResult.executionTime;

                return (
                  <tr
                    key={result.algorithmName}
                    className={`border-b border-gray-700 transition-colors ${
                      isFastest ? "bg-violet-900 bg-opacity-20" : "hover:bg-gray-800 bg-opacity-30"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${
                          isFastest ? "text-violet-300" : "text-white"
                        }`}
                      >
                        {getFriendlyLabel(result.algorithmName)}
                      </span>
                      {isFastest && (
                        <span className="ml-2 inline-block px-2 py-1 text-xs font-bold bg-violet-600 text-white rounded">
                          FASTEST
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-gray-200">
                        {result.executionTime.toFixed(4)} ms
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-32 h-6 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-300"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-200 font-semibold">
                        {matchCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setExpandedAlgorithm(
                            expandedAlgorithm === result.algorithmName
                              ? null
                              : result.algorithmName
                          )
                        }
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded text-sm font-medium transition-colors"
                      >
                        {expandedAlgorithm === result.algorithmName
                          ? "Hide"
                          : "Show"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked View */}
        <div className="md:hidden space-y-3">
          {results.map((result) => {
            const matchCount = result.searchResultDTO.reduce(
              (acc, doc) => acc + doc.occurrences.length,
              0
            );
            const barWidth = (result.executionTime / maxExecutionTime) * 100;
            const isFastest =
              result.executionTime === fastestResult.executionTime;

            return (
              <div
                key={result.algorithmName}
                className={`p-4 rounded-lg border transition-all ${
                  isFastest
                    ? "bg-violet-900 bg-opacity-30 border-violet-600"
                    : "bg-gray-800 bg-opacity-50 border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">
                        {getFriendlyLabel(result.algorithmName)}
                      </h4>
                    {isFastest && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-bold bg-violet-600 text-white rounded">
                        FASTEST
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-mono font-semibold ${
                      isFastest ? "text-violet-300" : "text-gray-200"
                    }`}
                  >
                    {result.executionTime.toFixed(4)} ms
                  </span>
                </div>

                {/* Bar Visualization */}
                <div className="mb-3">
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                {/* Match Count */}
                <div className="mb-3 flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Matches:</span>
                  <span className="font-semibold text-white">{matchCount}</span>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() =>
                    setExpandedAlgorithm(
                      expandedAlgorithm === result.algorithmName
                        ? null
                        : result.algorithmName
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded text-sm font-medium transition-colors"
                >
                  {expandedAlgorithm === result.algorithmName
                    ? "Hide Details"
                    : "Show Details"}
                </button>

                {/* Expandable Details */}
                {expandedAlgorithm === result.algorithmName && (
                  <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
                    {result.searchResultDTO.length > 0 ? (
                      result.searchResultDTO.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="p-3 bg-gray-900 bg-opacity-50 rounded border border-gray-600"
                        >
                          <p className="text-white text-sm font-medium mb-1">
                            {doc.documentName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {doc.occurrences.length} occurrence
                            {doc.occurrences.length !== 1 ? "s" : ""}
                          </p>
                          <div className="text-gray-300 text-xs mt-2 font-mono break-all">
                            Positions: {doc.occurrences.join(", ")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No matches in documents
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Details Section for Desktop */}
      {expandedAlgorithm && (
        <div className="hidden md:block p-6 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            {expandedAlgorithm} - Match Details
          </h3>
          <div className="space-y-3">
            {results
              .find((r) => r.algorithmName === expandedAlgorithm)
              ?.searchResultDTO.map((doc, docIndex) => (
                <div
                  key={docIndex}
                  className="p-4 bg-gray-800 bg-opacity-50 rounded border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white font-semibold">{doc.documentName}</p>
                    <span className="text-gray-400 text-sm">
                      {doc.occurrences.length} occurrence
                      {doc.occurrences.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-400">Match Positions:</span>
                    <code className="block font-mono text-violet-300 mt-2 p-2 bg-gray-900 rounded break-all">
                      [{doc.occurrences.join(", ")}]
                    </code>
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Metadata Info */}
      <div className="p-4 bg-gray-900 bg-opacity-30 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-xs">
          <span className="text-gray-300 font-semibold">Search Term:</span>{" "}
          &quot;{results[0]?.searchTerm}&quot;
        </p>
        <p className="text-gray-400 text-xs mt-1">
          <span className="text-gray-300 font-semibold">Algorithms Compared:</span>{" "}
          {results.length}
        </p>
      </div>
    </div>
  );
}
