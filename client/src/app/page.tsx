import React from "react";
// import "../styles/globals.css";
import Navbar from "../components/navbar";
import BlurredText from "../components/document/blurredtext";
// import { Provider } from "../components/context/appContext";

export default function Home() {
	return (
		<div>
			<Navbar />
			<BlurredText />
			{/* <Component {...pageProps} /> */}
		</div>
	);
}
