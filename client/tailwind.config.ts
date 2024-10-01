import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#181E41",
				secondary: "#342F67",
				accent: "#FF4D6D",
			},
		},
	},
	plugins: [forms, typography],
};
export default config;
