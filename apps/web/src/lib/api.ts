import { getServerApiBaseUrl } from "@/config/env";
import type { HealthResponse, ProblemDetails } from "@/types/api";
import type { Project, ProjectSummary } from "@/types/project";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: ProblemDetails,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiNotFoundError extends ApiError {
  constructor(message: string, details?: ProblemDetails) {
    super(message, 404, details);
    this.name = "ApiNotFoundError";
  }
}

type ApiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

async function readProblemDetails(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/problem+json")) {
    return undefined;
  }

  return (await response.json()) as ProblemDetails;
}

async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {},
) {
  const response = await fetch(`${getServerApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const details = await readProblemDetails(response);
    const message =
      details?.detail ??
      details?.title ??
      `Portfolio API request failed with status ${response.status}.`;

    if (response.status === 404) {
      throw new ApiNotFoundError(message, details);
    }

    throw new ApiError(message, response.status, details);
  }

  return (await response.json()) as TResponse;
}

export async function getHealth() {
  return apiFetch<HealthResponse>("/api/health", {
    cache: "no-store",
  });
}

export async function getProjects() {
  return apiFetch<ProjectSummary[]>("/api/projects", {
    next: {
      revalidate: 60,
    },
  });
}

export async function getProjectBySlug(slug: string) {
  try {
    return await apiFetch<Project>(
      `/api/projects/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: 60,
        },
      },
    );
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      return null;
    }

    throw error;
  }
}
