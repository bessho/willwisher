import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ApprovalGateProps {
  children: React.ReactNode;
}

export function ApprovalGate({ children }: ApprovalGateProps) {
  // All users are automatically approved, so we just render the children
  return <>{children}</>;
}
