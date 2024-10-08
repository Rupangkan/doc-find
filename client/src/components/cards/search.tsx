"use client";

import { useState } from "react";

export default function SearchCard() {
	const [showAdvanced, setShowAdvanced] = useState(false);

	return (
		<div className="flex flex-col items-center justify-center py-10">
			{/* Search Bar */}
			<div className="relative w-full max-w-md text-gray-200">
				<input
					type="text"
					placeholder="Type Keywords"
					className="w-full px-4 py-2 rounded-full shadow-lg bg-transparent backdrop-blur-md focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition duration-300 placeholder-gray-400"
				/>
			</div>

			{/* Toggle Button */}
			<button
				onClick={() => setShowAdvanced(!showAdvanced)}
				className="mt-4 text-blue-400 flex justify-start"
			>
				Advanced Search
			</button>

			{/* Advanced Search Section */}
			{showAdvanced && (
				<div className="mt-4 w-full max-w-md p-4 shadow-lg rounded-lg bg-transparent backdrop-blur-md">
					<div className="grid grid-cols-2 gap-4">
						<select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-transparent text-white">
							<option>Accessories</option>
							<option>Shoes</option>
							<option>Clothes</option>
						</select>
						<select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-transparent text-white">
							<option>Color</option>
							<option>Red</option>
							<option>Blue</option>
						</select>
						<select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-transparent text-white">
							<option className="bg-transparent">
								Size
							</option>
							<option>Small</option>
							<option>Medium</option>
							<option>Large</option>
						</select>
						<select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-transparent text-white">
							<option>Sale</option>
							<option>Yes</option>
							<option>No</option>
						</select>
						<select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-transparent text-white">
							<option>Time</option>
							<option>Today</option>
							<option>This Week</option>
						</select>
						<select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-transparent text-white">
							<option>Type</option>
							<option>New</option>
							<option>Popular</option>
						</select>
					</div>
					<div className="flex justify-center mt-4">
						<button className="text-red-500">
							Reset
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
