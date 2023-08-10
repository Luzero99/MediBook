import { Role } from "./ExtendendJwtPayload";

export interface AuthContextValues {
  id: string | null;
  role: Role | null;
  isLoggedIn: boolean;
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}
