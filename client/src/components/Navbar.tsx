import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
	return (
		<nav className="flex justify-between items-center py-6 px-8 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500">
			<div className="flex items-center space-x-4">
				{/* Logo */}
				<div className="text-white font-bold text-xl">
					cashfly
				</div>
			</div>

			<div className="hidden md:flex items-center space-x-6 text-white">
				{/* Navigation links */}
				<Link href="/about" className="hover:text-indigo-300">
					About
				</Link>
				<Link href="/product" className="hover:text-indigo-300">
					Product
				</Link>
				<Link href="/pricing" className="hover:text-indigo-300">
					Pricing
				</Link>
			</div>

			{/* Sign up button */}
			<div>
				<Link href="/signup">
					<button className="bg-white text-purple-500 font-semibold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300">
						Sign up
					</button>
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
