import React from "react";
import Navbar from "../components/navigation/navbar";
import DocumentSearchFlow from "./results/results";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 pb-8">
                <DocumentSearchFlow />
            </main>
        </div>
    );
}
