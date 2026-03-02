export type Role = 'teacher' | 'principal';

export interface User {
  username: string;
  role: Role;
  displayName: string;
  classSection?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
