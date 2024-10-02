import React from "react";
// import "../styles/globals.css";
import Navbar from "../components/navigation/navbar";
import BlurredText from "../components/cards/blurredtext";
import IntroCard from "../components/cards/introcard";
import SignIn from "./signin/page";
// import { Provider } from "../components/context/appContext";

export default function Home() {
	return (
		<div>
			<Navbar />
			<SignIn />
			<div className="flex flex-col lg:flex-row lg:justify-between w-full">
				{/* <SignIn /> */}
				{/* <IntroCard />
				<BlurredText /> */}
				{/* <SignIn /> */}
			</div>
		</div>
	);
}
