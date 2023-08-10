import { JwtPayload } from "jwt-decode";

export enum Role {
  ROLE_USER = "ROLE_USER",
  ROLE_PATIENT = "ROLE_PATIENT",
  ROLE_DOCTOR = "ROLE_DOCTOR",
}

export interface ExtendendJwtPayload extends JwtPayload {
  role?: Role;
  id?: string;
}