"use client";

import { useState } from "react";
import backgroundImage from "../public/background.jpg";

export default function SignIn() {
	const [isSignup, setIsSignup] = useState(true);

	const switchSignup = () => {
		setIsSignup(true);
	};

	const switchLogin = () => {
		setIsSignup(false);
	};

	return (
		<div className="relative flex items-center">
			<section className="w-1/2 relative hidden lg:flex flex-col justify-center items-center">
				<div className="text-center space-y-4">
					{!isSignup ? (
						<>
							<h1 className="text-white text-5xl">
								Hi there!
							</h1>
							<h3 className="text-white text-3xl">
								Don't have an account?
							</h3>
							<button
								onClick={switchSignup}
								className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-sm"
							>
								Signup
							</button>
						</>
					) : (
						<>
							<h1 className="text-white text-5xl">
								Welcome!
							</h1>
							<h3 className="text-white text-3xl">
								Already have an account?
							</h3>
							<button
								onClick={switchLogin}
								className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-lg hover:shadow-sm"
							>
								Login
							</button>
						</>
					)}
				</div>
			</section>

			<section className="w-1/2 flex flex-col justify-center items-center relative">
				<div className="p-8 w-full max-w-sm">
					{isSignup ? (
						<>
							<form className="space-y-4 text-white">
								<input
									type="text"
									name="user-name"
									placeholder="User Name"
									autoComplete="off"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-md bg-transparent backdrop-blur-md focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition duration-300 placeholder-gray-400"
									// className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition duration-300 placeholder-gray-400"
								/>
								<input
									type="password"
									name="user-pass"
									autoComplete="off"
									placeholder="Password"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-md bg-transparent backdrop-blur-md focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition duration-300 placeholder-gray-400"
								/>
								<input
									type="password"
									name="user-pass"
									autoComplete="off"
									placeholder="Confirm Password"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-md bg-transparent backdrop-blur-md focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition duration-300 placeholder-gray-400"
								/>
								<button
									type="button"
									className="w-full bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
								>
									Signup
								</button>
							</form>
						</>
					) : (
						<>
							<form className="space-y-4 text-white">
								<input
									type="text"
									name="user-name"
									autoComplete="off"
									placeholder="User Name"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-md bg-transparent backdrop-blur-md focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition duration-300 placeholder-gray-400"
								/>
								<input
									type="password"
									name="user-pass"
									autoComplete="off"
									placeholder="Password"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-md bg-transparent backdrop-blur-md focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition duration-300 placeholder-gray-400"
								/>
								<button
									type="button"
									className="w-full bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
								>
									Login
								</button>
							</form>
						</>
					)}
				</div>
			</section>
		</div>
	);
}
