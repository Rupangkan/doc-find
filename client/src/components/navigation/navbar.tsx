import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
	return (
		<nav className="flex justify-between items-center py-6 px-8 ">
			<div className="flex items-center space-x-4">
				<div className="text-white text-3xl">Docfind</div>
			</div>

			<div className="flex items-center space-x-20">
				<div className="hidden md:flex items-end space-x-20 text-white">
					<Link
						href="/about"
						className="hover:text-indigo-300 text-lg"
					>
						About
					</Link>
					<Link
						href="/product"
						className="hover:text-indigo-300 text-lg"
					>
						Product
					</Link>
				</div>

				<div>
					<Link href="/signin">
						<button className="text-white text-lg py-2 px-6 rounded-full bg-blue-800 hover:bg-blue-700 transition duration-300">
							Sign up
						</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
