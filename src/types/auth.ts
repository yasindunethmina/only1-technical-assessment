export type UserT = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: string;
  updatedAt: string | null;
};

export type SessionT = {
  id: string;
  email: string;
};

export type AuthResponseT = {
  user: UserT;
  session: SessionT;
};

export type AuthContextT = {
  session: SessionT | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};
