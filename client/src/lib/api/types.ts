export interface Document {
  id: string;
  documentName: string;
  content: string;
  userName: string;
}

export interface SearchResultDTO {
  documentName: string;
  occurrences: number[];
}

export interface SearchPerformanceDTO {
  algorithmName: string;
  searchTerm: string;
  isFound: boolean;
  executionTime: number;
  searchResultDTO: SearchResultDTO[];
}

export interface PostResponseDTO {
  message: string;
  code: number;
  httpStatus: string;
}

export interface GetResponseDTO<T> {
  message: string;
  code: number;
  httpStatus: string;
  data: T;
}

export interface JwtResponse {
  userName: string;
  jwtToken: string;
}

export interface JwtRequest {
  userName: string;
  password: string;
}

export interface User {
  id: string;
  userName: string;
  password: string;
}

export interface ApiError {
  message: string;
  code: number;
  httpStatus: string;
}
