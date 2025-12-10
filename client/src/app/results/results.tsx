"use client";

import { useState } from "react";
import DocumentUploadPanel from "../../components/DocumentUploadPanel";
import SearchControls from "../../components/SearchControls";
import ResultsComparisonPanel from "../../components/ResultsComparisonPanel";
import { SearchPerformanceDTO } from "../../lib/api/types";

interface UploadedDocument {
    name: string;
    size: number;
    uploadedAt: string;
}

export default function DocumentSearchFlow() {
    const [currentStep, setCurrentStep] = useState(1);
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>(
        []
    );
    const [searchResults, setSearchResults] = useState<SearchPerformanceDTO[]>(
        []
    );

    const steps = [1, 2, 3, 4];

    const handleStepClick = (step: number) => {
        // Only allow navigation to completed steps or the next step
        if (step <= currentStep + 1) {
            setCurrentStep(step);
        }
    };

    const handleUploadComplete = (documents: UploadedDocument[]) => {
        setUploadedDocuments((prev) => [...prev, ...documents]);
        // Automatically move to next step after successful upload
        if (documents.length > 0) {
            setCurrentStep(2);
        }
    };

    const handleSearchComplete = (results: SearchPerformanceDTO[]) => {
        setSearchResults(results);
        setCurrentStep(3);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-10 px-4 py-8 md:px-0">
            {/* Step Indicator */}
            <div className="flex justify-center items-center space-x-2 md:space-x-12 w-full overflow-x-auto pb-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center flex-shrink-0">
                        {/* Circle for each step */}
                        <button
                            onClick={() => handleStepClick(step)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 flex-shrink-0 ${
                                currentStep >= step
                                    ? "bg-violet-700 text-white border-violet-500 cursor-pointer hover:bg-violet-600"
                                    : "text-white border-gray-600 cursor-not-allowed"
                            }`}
                            disabled={step > currentStep + 1}
                            title={`Step ${step}${step > currentStep + 1 ? " (locked)" : ""}`}
                        >
                            {currentStep > step ? (
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
                                <span className="text-sm font-semibold">{`0${step}`}</span>
                            )}
                        </button>

                        {/* Horizontal line between steps */}
                        {index !== steps.length - 1 && (
                            <div className="flex items-center w-12 md:w-28 mx-1 md:ml-4 flex-shrink-0">
                                {/* Line background */}
                                <div className="h-1 w-full bg-gray-400">
                                    {/* Progress bar (purple) */}
                                    <div
                                        className="h-1 bg-violet-800 transition-all duration-300"
                                        style={{
                                            width: currentStep > step ? "100%" : "0%",
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
                <div className="w-full max-w-xl mx-auto px-4">
                    <div className="p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-700">
                        <h2 className="text-2xl text-white font-semibold mb-2">
                            Upload Documents
                        </h2>
                        <p className="text-gray-300 text-sm mb-6">
                            Add PDF, TXT, DOC, or DOCX files to get started
                        </p>
                        <DocumentUploadPanel onUploadComplete={handleUploadComplete} />
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="w-full max-w-xl mx-auto px-4">
                    <div className="p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-700">
                        <h2 className="text-2xl text-white font-semibold mb-2">
                            Search Documents
                        </h2>
                        <p className="text-gray-300 text-sm mb-6">
                            {uploadedDocuments.length > 0
                                ? `${uploadedDocuments.length} document${uploadedDocuments.length !== 1 ? "s" : ""} uploaded`
                                : "No documents uploaded yet"}
                        </p>
                        <SearchControls
                            documentsCount={uploadedDocuments.length}
                            onSearchComplete={handleSearchComplete}
                        />
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="w-full max-w-5xl mx-auto px-4">
                    <div className="p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-700">
                        <h2 className="text-2xl text-white font-semibold mb-4">
                            Results Comparison
                        </h2>
                        <ResultsComparisonPanel results={searchResults} />
                        {searchResults.length > 0 && (
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setCurrentStep(2)}
                                    className="flex-1 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                                >
                                    Back to Search
                                </button>
                                <button
                                    onClick={() => setCurrentStep(4)}
                                    className="flex-1 px-6 py-2 bg-violet-700 hover:bg-violet-600 text-white rounded-lg transition-colors font-medium"
                                >
                                    Continue to Export
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {currentStep === 4 && (
                <div className="w-full max-w-xl mx-auto px-4">
                    <div className="p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-700 text-center">
                        <h2 className="text-2xl text-white font-semibold mb-4">
                            Step 4: Export
                        </h2>
                        <p className="text-gray-300">Export content coming soon...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
