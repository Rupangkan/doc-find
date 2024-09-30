import React from "react";
// import "../styles/globals.css";
import Navbar from "../components/Navbar";

export default function Home() {
	return (
		<div>
			{/* <Navbar /> */}
			{/* <Component {...pageProps} /> */}
			<div className="bg-gradient-to-r from-primary to-secondary min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-5xl font-bold text-white mb-6">
						Payments have never been easier
					</h1>
					<p className="text-white mb-8">
						Discover the easiest way to manage your
						personal finances.
					</p>

					<div className="flex justify-center gap-8">
						{/* Glassmorphic Card 1 */}
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-pink-500/30 opacity-50 rounded-xl"></div>
						<div className="relative z-10 text-left text-white">
							<p className="mb-4 text-lg">
								CARD HOLDER: Joshua Cash
							</p>
							<p className="text-lg font-semibold">
								3516 8643 7614 9242
							</p>
							<p>Expiry: 11/27</p>
						</div>

						{/* Glassmorphic Card 2 */}
						<div className="relative bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
							<div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 to-indigo-400/30 opacity-50 rounded-xl"></div>
							<div className="relative z-10 text-left text-white">
								<p className="mb-4 text-lg">
									CARD HOLDER: Sarah Gold
								</p>
								<p className="text-lg font-semibold">
									5136 7541 0873 0029
								</p>
								<p>Expiry: 09/24</p>
							</div>
						</div>
					</div>

					<div className="mt-8">
						<button className="bg-accent text-white py-3 px-8 rounded-full shadow-md hover:bg-accent/90 transition">
							Get Started
						</button>
						<button className="ml-4 text-white py-3 px-8 border border-white rounded-full shadow-md hover:bg-white/10 transition">
							Download App
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
