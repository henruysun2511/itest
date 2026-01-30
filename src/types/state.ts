import { UserJwtDecode } from "./body";

interface AuthState {
  user: UserJwtDecode | null; 
  accessToken: string | null;
  isHydrated: boolean;

  setAuth: (user: UserJwtDecode, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}
export type { AuthState };

