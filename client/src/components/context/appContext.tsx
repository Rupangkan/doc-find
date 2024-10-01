"use client";

import React, { useReducer, createContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";

// Define types for the state and actions
interface User {
	// Define user properties based on your application
	id: string;
	name: string;
}

interface State {
	user: User | null;
}

interface Action {
	type: "LOGIN" | "LOGOUT";
	payload?: User | null;
}

// Initial state
const initialState: State = {
	user: null,
};

// Create context
const Context = createContext<
	{ state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

// Root reducer
const rootReducer = (state: State, action: Action): State => {
	if (typeof window !== "undefined") {
		switch (action.type) {
			case "LOGIN":
				return { ...state, user: action.payload };
			case "LOGOUT":
				return { ...state, user: null };
			default:
				return state;
		}
	}
};

// Context provider
const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(rootReducer, initialState);

	// Router
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const user = window.localStorage.getItem("user");
			if (user) {
				dispatch({ type: "LOGIN", payload: JSON.parse(user) });
			}
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const handleResponse = async (response: Response) => {
				if (response.status === 401) {
					console.log("/401 error > logout");
					dispatch({ type: "LOGOUT" });
					window.localStorage.removeItem("user");
					router.push("/login");
				}
				return response;
			};
			const getCsrfToken = async () => {
				const res = await fetch("/api/csrf-token");
				const data = await res.json();
				if (res.ok) {
					// Set CSRF token in fetch headers
					fetch.defaults.headers["X-CSRF-TOKEN"] =
						data.getCsrfToken;
				}
			};

			getCsrfToken();

			// Example of setting up a custom fetch function to handle logout
			const customFetch = async (
				input: RequestInfo,
				init?: RequestInit
			) => {
				const response = await fetch(input, init);
				return handleResponse(response);
			};
		}

		// Replace all fetch calls with customFetch in your app
	}, [router]);

	return (
		<Context.Provider value={{ state, dispatch }}>
			{children}
		</Context.Provider>
	);
};

export { Context, Provider };
