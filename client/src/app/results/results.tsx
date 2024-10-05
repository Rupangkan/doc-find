"use client";

import { useState } from "react";

export default function FileUpload() {
	const [files, setFiles] = useState([]);

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
	};

	const removeFile = (index) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	const handleUpload = async () => {
		const formData = new FormData();
		files.forEach((file) => formData.append("files[]", file));

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});
			if (response.ok) {
				console.log("Files uploaded successfully!");
			}
		} catch (error) {
			console.error("Error uploading files:", error);
		}
	};

	return (
		<div className="p-6 rounded-lg shadow-md w-full max-w-xl mx-auto backdrop-filter backdrop-blur-md bg-opacity-50">
			<h2 className="text-xl text-white font-semibold mb-4">
				Upload Files
			</h2>
			<div
				className="border-dashed border-2 border-gray-300 p-6 mb-4 rounded-lg text-center backdrop-filter backdrop-blur-xl bg-opacity-50"
				onDrop={(e) => {
					e.preventDefault();
					const droppedFiles = Array.from(
						e.dataTransfer.files
					);
					handleFileChange({
						target: { files: droppedFiles },
					});
				}}
				onDragOver={(e) => e.preventDefault()}
			>
				<p className="text-gray-500">
					Drag & drop your files here or
				</p>
				<input
					type="file"
					id="file-upload"
					className="hidden"
					multiple
					onChange={handleFileChange}
				/>
				<label
					htmlFor="file-upload"
					className="text-blue-500 cursor-pointer underline"
				>
					Choose files
				</label>
			</div>

			{/* Uploaded Files */}
			<div className="space-y-3">
				{files.map((file, index) => (
					<div
						key={index}
						className="p-3 rounded-lg shadow-md flex items-center justify-between"
					>
						<div>
							<p className="text-white">
								{file.name}
							</p>
							<p className="text-white text-sm">
								{Math.round(file.size / 1024)}{" "}
								KB
							</p>
						</div>
						<button
							onClick={() => removeFile(index)}
							className="text-red-500 hover:text-red-700"
						>
							Remove
						</button>
					</div>
				))}
			</div>

			<button
				onClick={handleUpload}
				className="w-full bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-lg hover:shadow-sm "
			>
				Upload Files
			</button>
		</div>
	);
}
