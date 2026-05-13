const DEFAULT_API_BASE_URL = "http://localhost:5000";

function normalizeUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getPublicApiBaseUrl() {
  return normalizeUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  );
}

export function getServerApiBaseUrl() {
  return normalizeUrl(process.env.INTERNAL_API_BASE_URL ?? getPublicApiBaseUrl());
}
