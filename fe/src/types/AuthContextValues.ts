export interface AuthContextValues {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}
