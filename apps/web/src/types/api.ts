export type HealthResponse = {
  status: "ok";
  service: "portfolio-api";
};

export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
};
