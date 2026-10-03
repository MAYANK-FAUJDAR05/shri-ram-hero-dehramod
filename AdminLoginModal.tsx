import React from 'react';
import { AdminLogin } from '../AdminLogin';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  return (
    <AdminLogin
      isOpen={isOpen}
      onClose={onClose}
      onLoginSuccess={onLoginSuccess}
      variant="modal"
      title="Central Admin Authentication"
      subtitle="Protected by environment-variable verified server logic"
    />
  );
};

