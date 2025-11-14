// API Configuration
export const API_BASE_URL = "https://sw-api.starnavi.io";

export const API_ENDPOINTS = {
  PEOPLE: "/people",
  FILMS: "/films",
  STARSHIPS: "/starships",
} as const;

// Rate limiting constants
export const REQUEST_DELAY = 150; // Delay between requests in milliseconds
export const MAX_RETRIES = 3; // Maximum number of retries for 429 errors
export const RETRY_DELAY = 1000; // Initial delay for retries in milliseconds
export const HTTP_STATUS = {
  TOO_MANY_REQUESTS: 429,
} as const;


