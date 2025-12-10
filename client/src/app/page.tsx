import React from "react";
import Navbar from "../components/navigation/navbar";
import FileUpload from "./results/results";

export default function Home() {
    return (
        <div>
            <Navbar />
            <FileUpload />
            {/* <SignIn /> */}
            <div className="flex flex-col lg:flex-row lg:justify-between w-full">
                {/* <SignIn /> */}
                {/* <IntroCard /> */}
                {/* <BlurredText /> */}
                {/* <SignIn /> */}
            </div>
        </div>
    );
}
