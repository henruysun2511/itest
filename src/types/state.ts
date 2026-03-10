
interface User {
  accountId: string; // Lấy từ decoded.sub
  roleName: string;  // Lấy từ decoded.roleName
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

