"use client";


import { useState } from "react";
import DocumentUploadPanel from "../../components/DocumentUploadPanel";
import SearchControls from "../../components/SearchControls";
import ResultsComparisonPanel from "../../components/ResultsComparisonPanel";
import { SearchPerformanceDTO } from "../../lib/api/types";
import { fetchDocuments } from "../../lib/api/client";

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
    const [isVerifyingDocuments, setIsVerifyingDocuments] = useState(false);
    const [documentError, setDocumentError] = useState<string | null>(null);

    const steps = [1, 2, 3, 4];

    // Verify documents from server when transitioning to step 2
    const verifyServerDocuments = async () => {
        setIsVerifyingDocuments(true);
        setDocumentError(null);
        
        try {
            const serverDocuments = await fetchDocuments();
            console.log('Retrieved documents from server:', serverDocuments.length);
            

            // Convert server documents to our local format
            const documentsForUI: UploadedDocument[] = serverDocuments.map(doc => ({
                name: doc.documentName || 'Unknown',
                size: doc.content ? doc.content.length : 0,
                uploadedAt: new Date().toISOString() // Use current time since server doesn't track upload time
            }));
            
            setUploadedDocuments(documentsForUI);
        } catch (error) {
            console.error('Error fetching documents from server:', error);
            setDocumentError('Failed to load uploaded documents. Please try refreshing the page.');
        } finally {
            setIsVerifyingDocuments(false);
        }
    };

    const handleStepClick = (step: number) => {
        // Only allow navigation to completed steps or the next step
        if (step <= currentStep + 1) {
            setCurrentStep(step);
        }
    };


    const handleUploadComplete = (documents: UploadedDocument[]) => {
        setUploadedDocuments((prev) => [...prev, ...documents]);
    };


    const handleNextClick = async () => {
        setCurrentStep(2);
        // Verify documents from server when transitioning to step 2
        await verifyServerDocuments();
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

                        <DocumentUploadPanel 
                            onUploadComplete={handleUploadComplete}
                            onNextClick={handleNextClick}
                        />
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
                            {isVerifyingDocuments ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying uploaded documents...
                                </span>
                            ) : documentError ? (
                                <span className="text-red-400">{documentError}</span>
                            ) : uploadedDocuments.length > 0 ? (
                                `${uploadedDocuments.length} document${uploadedDocuments.length !== 1 ? "s" : ""} uploaded and ready for search`
                            ) : (
                                "No documents uploaded yet"
                            )}
                        </p>
                        
                        {/* Show retry button if there's an error */}
                        {documentError && (
                            <button
                                onClick={verifyServerDocuments}
                                className="mb-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Retry
                            </button>
                        )}
                        
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
