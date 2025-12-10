"use client";

import { useState } from "react";
import { uploadDocuments } from "../lib/api";

const ALLOWED_EXTENSIONS = ["pdf", "txt", "doc", "docx"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface FileWithProgress {
    file: File;
    progress: number;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
}

interface UploadedDocument {
    name: string;
    size: number;
    uploadedAt: string;
}

interface DocumentUploadPanelProps {
    onUploadComplete?: (documents: UploadedDocument[]) => void;
}

export default function DocumentUploadPanel({
    onUploadComplete,
}: DocumentUploadPanelProps) {
    const [filesWithProgress, setFilesWithProgress] = useState<FileWithProgress[]>(
        []
    );
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>(
        []
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const validateFile = (file: File): string | null => {
        const extension = file.name.split(".").pop()?.toLowerCase();

        if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
            return `Invalid file type: ${file.name}. Allowed types: ${ALLOWED_EXTENSIONS.join(
                ", "
            ).toUpperCase()}`;
        }

        if (file.size > MAX_FILE_SIZE) {
            return `File too large: ${file.name}. Maximum size is 50MB`;
        }

        return null;
    };

    const handleFileChange = (newFiles: FileList | null) => {
        if (!newFiles) return;

        setErrorMessage(null);
        const filesToAdd: FileWithProgress[] = [];
        const errors: string[] = [];

        Array.from(newFiles).forEach((file) => {
            const validationError = validateFile(file);
            if (validationError) {
                errors.push(validationError);
            } else {
                filesToAdd.push({
                    file,
                    progress: 0,
                    status: "pending",
                });
            }
        });

        if (errors.length > 0) {
            setErrorMessage(errors.join("\n"));
        }

        setFilesWithProgress((prevFiles) => [...prevFiles, ...filesToAdd]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        handleFileChange(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const removeFile = (index: number) => {
        setFilesWithProgress((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setErrorMessage(null);
    };

    const handleUpload = async () => {
        const pendingFiles = filesWithProgress
            .filter((f) => f.status === "pending")
            .map((f) => f.file);

        if (pendingFiles.length === 0) {
            setErrorMessage("No files to upload");
            return;
        }

        // Mark all files as uploading
        setFilesWithProgress((prevFiles) =>
            prevFiles.map((f) =>
                f.status === "pending" ? { ...f, status: "uploading" } : f
            )
        );

        try {
            await uploadDocuments(pendingFiles);

            // Mark all uploading files as success
            const newUploadedDocs: UploadedDocument[] = [];
            setFilesWithProgress((prevFiles) =>
                prevFiles.map((f) => {
                    if (f.status === "uploading") {
                        newUploadedDocs.push({
                            name: f.file.name,
                            size: f.file.size,
                            uploadedAt: new Date().toISOString(),
                        });
                        return { ...f, status: "success", progress: 100 };
                    }
                    return f;
                })
            );

            setUploadedDocuments((prev) => [...prev, ...newUploadedDocs]);
            setErrorMessage(null);

            if (onUploadComplete) {
                onUploadComplete(newUploadedDocs);
            }
        } catch (error) {
            const errorMsg =
                error instanceof Error
                    ? error.message
                    : typeof error === "object" &&
                      error !== null &&
                      "message" in error
                    ? String((error as Record<string, unknown>).message)
                    : "Upload failed";

            setErrorMessage(errorMsg);

            // Mark all uploading files as error
            setFilesWithProgress((prevFiles) =>
                prevFiles.map((f) =>
                    f.status === "uploading"
                        ? { ...f, status: "error", error: errorMsg }
                        : f
                )
            );
        }
    };

    return (
        <div className="w-full">
            {/* Error Banner */}
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg text-red-200 text-sm whitespace-pre-line">
                    {errorMessage}
                </div>
            )}

            {/* Drag and Drop Area */}
            <div
                className={`border-dashed border-2 p-6 mb-4 rounded-lg text-center transition-colors ${
                    isDragActive
                        ? "border-blue-400 bg-blue-900 bg-opacity-20"
                        : "border-gray-300 bg-opacity-50"
                } backdrop-filter backdrop-blur-xl`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <p className="text-gray-300 mb-2">Drag & drop your files here or</p>
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={(e) => handleFileChange(e.target.files)}
                />
                <label
                    htmlFor="file-upload"
                    className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
                >
                    choose files
                </label>
                <p className="text-gray-400 text-xs mt-2">
                    Supported: PDF, TXT, DOC, DOCX (Max 50MB per file)
                </p>
            </div>

            {/* Files List */}
            {filesWithProgress.length > 0 && (
                <div className="mb-4 space-y-3 max-h-96 overflow-y-auto">
                    {filesWithProgress.map((fileItem, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700 flex items-center justify-between gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">
                                    {fileItem.file.name}
                                </p>
                                <p className="text-gray-400 text-sm">
                                    {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>

                                {/* Progress Bar */}
                                {fileItem.status === "uploading" && (
                                    <div className="mt-2 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full transition-all duration-300"
                                            style={{ width: `${fileItem.progress}%` }}
                                        />
                                    </div>
                                )}

                                {/* Error Message */}
                                {fileItem.status === "error" && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {fileItem.error || "Upload failed"}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Status Badge */}
                                {fileItem.status === "pending" && (
                                    <span className="text-gray-400 text-sm">Pending</span>
                                )}
                                {fileItem.status === "uploading" && (
                                    <span className="text-blue-400 text-sm">
                                        {Math.round(fileItem.progress)}%
                                    </span>
                                )}
                                {fileItem.status === "success" && (
                                    <svg
                                        className="w-5 h-5 text-green-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                {fileItem.status === "error" && (
                                    <svg
                                        className="w-5 h-5 text-red-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}

                                {/* Remove Button */}
                                {fileItem.status === "pending" && (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-red-400 hover:text-red-300 transition-colors ml-2"
                                        title="Remove file"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {filesWithProgress.some((f) => f.status === "pending") && (
                <button
                    onClick={handleUpload}
                    className="w-full bg-violet-700 hover:bg-violet-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    disabled={!filesWithProgress.some((f) => f.status === "pending")}
                >
                    Upload Files
                </button>
            )}

            {/* Uploaded Documents Summary */}
            {uploadedDocuments.length > 0 && (
                <div className="mt-6 p-4 rounded-lg bg-green-900 bg-opacity-30 border border-green-600">
                    <h3 className="text-green-300 font-semibold mb-2">
                        ✓ {uploadedDocuments.length} document{uploadedDocuments.length !== 1 ? "s" : ""} uploaded
                        successfully
                    </h3>
                    <p className="text-green-200 text-sm">
                        Your documents are now available for searching.
                    </p>
                </div>
            )}
        </div>
    );
}
