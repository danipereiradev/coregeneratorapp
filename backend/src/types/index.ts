export const MIN_CLIPS = 2;
export const MAX_CLIPS = 10;
export const DEFAULT_MAX_UPLOAD_MB = 200;
export const MAX_PERSON_NAME_LENGTH = 60;
export const TRANSITION_DURATION_SEC = 2;

export interface GenerateErrorResponse {
  error: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}
