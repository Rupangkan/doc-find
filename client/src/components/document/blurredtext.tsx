import Link from "next/link";

export default function BlurredText() {
	const TextBlock = ({ children }) => (
		<div className="relative flex items-center">
			<div className="font-semibold text-sm text-center blur-xsm text-white">
				{children}
			</div>
		</div>
	);

	const HighlightedText = ({ children }) => (
		<div className="relative z-10 text-gray-300 text-md font-semibold px-1 py-1 bg-transparent">
			{children}
		</div>
	);

	return (
		<div className="relative flex items-center justify-center">
			<div className="transform -rotate-20">
				<div className="relative flex flex-col items-center justify-center space-y-1 h-full w-full backdrop-filter backdrop-blur-xl bg-opacity-50 px-8 py-6 border-2 rounded-3xl">
					<div className="relative flex items-center space-x-2">
						<TextBlock>
							Hi guys, nice to meet you.
						</TextBlock>
						<HighlightedText>
							<Link href="https://www.linkedin.in/in/rupangkan">
								I'm Rupangkan
							</Link>
						</HighlightedText>
						<TextBlock>Try out Docfind now!</TextBlock>
					</div>

					<TextBlock>
						I work on fun stuff like THIS. Simple CRUD
						applications bore me.
					</TextBlock>
					<TextBlock>
						So I thought why not create a project to
						search engine for plain text.
					</TextBlock>

					<div className="relative flex items-center space-x-2">
						<TextBlock>
							Docfind searches plain text with
						</TextBlock>
						<HighlightedText>
							Search Algorithms
						</HighlightedText>
						<TextBlock>and compares them.</TextBlock>
					</div>

					<TextBlock>
						The front end is made with Next 14. The
						backend in Spring Boot with Postgres.
					</TextBlock>

					<TextBlock>
						Here's some jibberish for the blurred text.
						If you are reading this, Congrats!
					</TextBlock>

					<TextBlock>
						You want to deep dive into how the User
						Interface or the project works.
					</TextBlock>

					<div className="relative flex items-center space-x-2">
						<TextBlock>Features such as</TextBlock>
						<HighlightedText>
							Autocomplete
						</HighlightedText>
						<TextBlock>
							is implemented data structure
						</TextBlock>
						<HighlightedText>Trie</HighlightedText>
					</div>

					<TextBlock>
						moment to appreciate the simplicity and
						power of what you’re working with.
					</TextBlock>

					<div className="relative flex items-center space-x-2">
						<HighlightedText>
							Indexing System
						</HighlightedText>
						<TextBlock>
							and how they come together to deliver
							relevant results.
						</TextBlock>
					</div>

					<TextBlock>
						As you dig deeper, let your ideas flow; this
						project has the potential to
					</TextBlock>

					<TextBlock>
						transform how people access information in a
						faster and efficient way!
					</TextBlock>

					<div className="relative flex items-center space-x-2">
						<TextBlock>Mismatch search with</TextBlock>
						<HighlightedText>
							Fuzzy Search
						</HighlightedText>
						<TextBlock>using</TextBlock>
						<HighlightedText>
							Levenshtein Distance
						</HighlightedText>
					</div>

					<TextBlock>
						transform how people access information in a
						faster and efficient way!
					</TextBlock>

					<div className="relative flex items-center space-x-2">
						<HighlightedText>
							Linear Search
						</HighlightedText>
						<TextBlock>
							with slowest time of O(nxm) improved
							with
						</TextBlock>
						<HighlightedText>KMP</HighlightedText>
					</div>

					<TextBlock>
						As you experiment with different indexing
						techniques of this engine.
					</TextBlock>

					<div className="relative flex items-center space-x-2">
						<TextBlock>Also used other algo</TextBlock>
						<HighlightedText>
							Rabin Karp
						</HighlightedText>
						<TextBlock>along with</TextBlock>
						<HighlightedText>
							Boyer Moore
						</HighlightedText>
						<TextBlock>algorithm</TextBlock>
					</div>

					<TextBlock>
						With every improvement, shape how people
						interact with knowledge.
					</TextBlock>
				</div>
			</div>
		</div>
	);
}
