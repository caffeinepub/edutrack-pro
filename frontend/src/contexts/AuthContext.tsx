import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, Role } from '../types/auth';
import {
  getItem,
  setItem,
  removeItem,
  STORAGE_KEYS,
  getRegisteredTeachers,
  saveRegisteredTeachers,
  RegisteredTeacher,
} from '../utils/storage';

interface RegisterTeacherParams {
  displayName: string;
  username: string;
  password: string;
  classSection: string;
}

type RegisterTeacherResult =
  | { success: true }
  | { success: false; error: string };

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  registerTeacher: (params: RegisterTeacherParams) => RegisterTeacherResult;
}

const DEMO_ACCOUNTS: { username: string; password: string; role: Role; displayName: string; classSection: string }[] = [
  { username: 'teacher', password: 'class1', role: 'teacher', displayName: 'Mr. Rajesh Kumar', classSection: 'Class 10-A' },
  { username: 'principal', password: 'admin', role: 'principal', displayName: 'Dr. Sunita Verma', classSection: 'All Classes' },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = getItem<User>(STORAGE_KEYS.AUTH);
    if (stored) {
      setUser(stored);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    // Check demo accounts first
    const demoAccount = DEMO_ACCOUNTS.find(
      (a) => a.username === username.trim() && a.password === password
    );
    if (demoAccount) {
      const u: User = {
        username: demoAccount.username,
        role: demoAccount.role,
        displayName: demoAccount.displayName,
        classSection: demoAccount.classSection,
      };
      setUser(u);
      setIsAuthenticated(true);
      setItem(STORAGE_KEYS.AUTH, u);
      return true;
    }

    // Check registered teachers
    const registeredTeachers = getRegisteredTeachers();
    const registeredAccount = registeredTeachers.find(
      (t) => t.username === username.trim() && t.password === password
    );
    if (registeredAccount) {
      const u: User = {
        username: registeredAccount.username,
        role: 'teacher',
        displayName: registeredAccount.displayName,
        classSection: registeredAccount.classSection,
      };
      setUser(u);
      setIsAuthenticated(true);
      setItem(STORAGE_KEYS.AUTH, u);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    removeItem(STORAGE_KEYS.AUTH);
  }, []);

  const registerTeacher = useCallback((params: RegisterTeacherParams): RegisterTeacherResult => {
    const { displayName, username, password, classSection } = params;

    const trimmedUsername = username.trim();

    // Check for duplicate username in demo accounts
    const isDemoConflict = DEMO_ACCOUNTS.some((a) => a.username === trimmedUsername);
    if (isDemoConflict) {
      return { success: false, error: 'This username is already taken. Please choose another.' };
    }

    // Check for duplicate username in registered teachers
    const existingTeachers = getRegisteredTeachers();
    const isRegisteredConflict = existingTeachers.some((t) => t.username === trimmedUsername);
    if (isRegisteredConflict) {
      return { success: false, error: 'This username is already taken. Please choose another.' };
    }

    const newTeacher: RegisteredTeacher = {
      username: trimmedUsername,
      password,
      displayName: displayName.trim(),
      classSection: classSection.trim() || 'My Class',
    };

    saveRegisteredTeachers([...existingTeachers, newTeacher]);
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, registerTeacher }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
