export default function IntroCard() {
	return (
		<div className="w-full lg:w-1/2">
			<div className="relative flex items-start justify-start p-24">
				<div className="text-white max-w-md">
					<h3 className="text-sm text-green-400 font-semibold mb-2">
						START SEARHING FOR YOUR DOCUMENTS
					</h3>
					<h1 className="text-5xl font-bold mb-4 leading-snug">
						Comparing search algorithms have never been
						easier
					</h1>
					<p className="text-lg mb-6">
						Explore the various types of search
						algorithms, comparing their execution times
						to identify which methods offer faster, more
						efficient text searches and which may result
						in slower performance.
					</p>
					<div className="flex space-x-4">
						<button className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
							Get started
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
