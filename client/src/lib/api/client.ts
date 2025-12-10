import {
  Document,
  SearchPerformanceDTO,
  PostResponseDTO,
  GetResponseDTO,
  JwtResponse,
  JwtRequest,
  User,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public code: number,
    public httpStatus: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

interface ApiFetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    ...fetchOptions.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (
    !(fetchOptions.body instanceof FormData) &&
    fetchOptions.body !== undefined
  ) {
    headers["Content-Type"] = "application/json";
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorCode = response.status;
    let errorStatus = response.statusText;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
      if (errorData.code !== undefined) {
        errorCode = errorData.code;
      }
      if (errorData.httpStatus) {
        errorStatus = errorData.httpStatus;
      }
    } catch {
      // If parsing fails, use default error message
    }

    throw new ApiClientError(errorMessage, errorCode, errorStatus);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text() as T;
}

export async function uploadDocuments(
  files: File[],
  signal?: AbortSignal
): Promise<PostResponseDTO> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  return apiFetch<PostResponseDTO>("/auth/upload-documents", {
    method: "POST",
    body: formData,
    signal,
  });
}

export async function fetchDocuments(
  signal?: AbortSignal
): Promise<Document[]> {
  const response = await apiFetch<GetResponseDTO<Document[]>>(
    "/auth/get-documents",
    {
      method: "GET",
      signal,
    }
  );
  return response.data;
}

export async function deleteDocuments(
  signal?: AbortSignal
): Promise<PostResponseDTO> {
  return apiFetch<PostResponseDTO>("/auth/delete-documents", {
    method: "POST",
    signal,
  });
}

export async function runSearch(
  searchTerm: string,
  caseSensitive: boolean,
  signal?: AbortSignal
): Promise<SearchPerformanceDTO[]> {
  const params = new URLSearchParams({
    "search-term": searchTerm,
    "case-sensitive": String(caseSensitive),
  });

  const response = await apiFetch<GetResponseDTO<SearchPerformanceDTO[]>>(
    `/auth/get-all-occurrences?${params.toString()}`,
    {
      method: "GET",
      signal,
    }
  );
  return response.data;
}

export async function register(
  user: Omit<User, "id">,
  signal?: AbortSignal
): Promise<PostResponseDTO> {
  return apiFetch<PostResponseDTO>("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
    signal,
  });
}

export async function login(
  credentials: JwtRequest,
  signal?: AbortSignal
): Promise<JwtResponse> {
  return apiFetch<JwtResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    signal,
  });
}
