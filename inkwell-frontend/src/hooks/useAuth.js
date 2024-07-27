import { useState, useEffect } from 'react';
import { isAuthenticated, getUsername, getUserFirstName } from '../services/authService';

const useAuth = () => {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setAuth(authenticated);
      if (authenticated) {
        setUsername(getUsername() || '');
        setFirstName(getUserFirstName() || '');
      } else {
        setUsername('');
        setFirstName('');
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return { auth, username, firstName };
};

export default useAuth;