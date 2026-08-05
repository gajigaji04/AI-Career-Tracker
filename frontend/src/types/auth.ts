export interface LoginRequest {
  email: string;
  password: string;
}

export type ExperienceLevel =
  | "STUDENT"
  | "JOB_SEEKER"
  | "NEW_DEVELOPER"
  | "JUNIOR_DEVELOPER"
  | "EXPERIENCED_DEVELOPER";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  jobTitle?: string;
  experienceLevel?: ExperienceLevel;
  yearsOfExperience?: number;
  interestedStack?: string[];
}
