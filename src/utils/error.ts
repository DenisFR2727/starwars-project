import type { ErrorResponse } from "../api/types";

export function handleApiError(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error
  ) {
    const err = error as ErrorResponse;
    return `Error ${err.code}: ${err.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
}
