import { useState } from 'react';
import * as authApi from '../api/authApi';
import { User } from '../domain/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function register(email: string, userName: string, password: string) {
    setError(null);
    try {
      await authApi.register({ email, userName, password });
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  }

  async function login(email: string, password: string) {
    setError(null);
    try {
      const data = await authApi.login({ email, password });
      setUser({ email, username: '', token: data.token }); // username можна отримати з бекенду, якщо є
      localStorage.setItem('token', data.token);
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('token');
  }

  return {
    user,
    error,
    register,
    login,
    logout,
  };
}
