import { v4 as uuidv4 } from 'uuid';

import { UserT, SessionT, AuthResponseT } from '../types/auth';
import { apiClient } from '../utils/client';

const getCurrentSession = async (): Promise<SessionT | null> => {
  try {
    const { data } = await apiClient.get<SessionT[]>('/sessions');
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Failed to get current session:', error);
    return null;
  }
};

 // Note: This is a simplified implementation for development purposes.
 // In production, passwords would be properly hashed and additional 
 // security measures would be implemented.
const register = async (
  userData: Omit<UserT, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AuthResponseT> => {
  const { data: existingUsers } = await apiClient.get<UserT[]>('/users');
  const userExists = existingUsers.some(
    (user) => user.email === userData.email
  );

  if (userExists) {
    throw new Error('User with this email already exists');
  }

  const now = new Date().toISOString();
  const user: UserT = {
    ...userData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: null,
  };

  const { data: createdUser } = await apiClient.post<UserT>('/users', user);
  const session = await createSession(createdUser.email);

  return {
    user: createdUser,
    session,
  };
};

const login = async (
  email: string,
  password: string
): Promise<AuthResponseT> => {
  const { data: users } = await apiClient.get<UserT[]>('/users');
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const session = await createSession(user.email);

  return {
    user,
    session,
  };
};

const createSession = async (email: string): Promise<SessionT> => {
  await clearSessions();

  const session: SessionT = {
    id: uuidv4(),
    email,
  };

  const { data } = await apiClient.post<SessionT>('/sessions', session);
  return data;
};

const clearSessions = async (): Promise<void> => {
  const { data: sessions } = await apiClient.get<SessionT[]>('/sessions');
  await Promise.all(
    sessions.map((session) => apiClient.delete(`/sessions/${session.id}`))
  );
};

const logout = async (): Promise<void> => {
  await clearSessions();
};

const checkAuth = async (): Promise<SessionT | null> => {
  return getCurrentSession();
};

export const authService = {
  register,
  login,
  logout,
  checkAuth,
};
