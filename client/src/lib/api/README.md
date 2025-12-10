# API Utilities

This directory contains typed API utilities for interacting with the Spring Boot backend.

## Configuration

Set the API base URL in your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Usage

### With Authentication

```typescript
import { useAuth } from '@/components/context/appContext';
import { fetchDocuments, uploadDocuments, runSearch } from '@/lib/api';

function MyComponent() {
  const { token } = useAuth();
  
  // Fetch documents
  const documents = await fetchDocuments(token);
  
  // Upload files
  const files = [file1, file2];
  const result = await uploadDocuments(files, token);
  
  // Run search
  const searchResults = await runSearch('searchTerm', true, token);
}
```

### Without Authentication (Login/Register)

```typescript
import { login, register } from '@/lib/api';

// Login
const loginResponse = await login({
  userName: 'user',
  password: 'password'
});

// Register
const registerResponse = await register({
  userName: 'newuser',
  password: 'password123'
});
```

### With Abort Signals

All API functions accept an optional `AbortSignal` for request cancellation:

```typescript
const controller = new AbortController();

try {
  const documents = await fetchDocuments(token, controller.signal);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request cancelled');
  }
}

// Cancel the request
controller.abort();
```

### Error Handling

All API functions throw `ApiClientError` on non-2xx responses:

```typescript
import { ApiClientError } from '@/lib/api';

try {
  const documents = await fetchDocuments(token);
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.code);
    console.error('HTTP Status:', error.httpStatus);
  }
}
```

## Available Functions

- `apiFetch<T>(endpoint, options)` - Base fetch wrapper
- `uploadDocuments(files, token?, signal?)` - Upload documents
- `fetchDocuments(token?, signal?)` - Get user's documents
- `deleteDocuments(token?, signal?)` - Delete user's documents
- `runSearch(searchTerm, caseSensitive, token?, signal?)` - Search across documents
- `login(credentials, signal?)` - User login
- `register(user, signal?)` - User registration

## TypeScript Types

All types are exported from `@/lib/api/types`:

- `Document` - Document entity
- `SearchResultDTO` - Search result with occurrences
- `SearchPerformanceDTO` - Search performance metrics
- `PostResponseDTO` - Generic POST response
- `GetResponseDTO<T>` - Generic GET response with data
- `JwtResponse` - Login response with token
- `JwtRequest` - Login credentials
- `User` - User entity
- `ApiError` - Error response structure
