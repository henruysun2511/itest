
interface User {
  accountId: string; 
  roleName: string;  
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

