import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('teacher' | 'principal')[];
}

export default function RoleGuard({ children, allowedRoles = ['teacher'] }: RoleGuardProps) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) return null;
  return <>{children}</>;
}
