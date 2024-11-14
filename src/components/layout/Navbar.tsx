import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-aria-components';

import { useAuth } from '../../contexts/AuthContext';
import { shortenEmail } from '../../utils/shortenEmail';

type NavbarProps = {
  email?: string;
};

const Navbar = ({ email }: NavbarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-gray-500" />
            <span className="ml-2 sm:flex hidden text-lg sm:text-xl font-semibold">
              PermissionPro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 truncate">
              {shortenEmail(email)}
            </span>
            <Button
              onPress={handleLogout}
              className="bg-white text-gray-900 border border-gray-900 px-3 sm:px-4 py-2 rounded-md text-sm hover:bg-gray-800 hover:text-white focus:outline-none "
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
