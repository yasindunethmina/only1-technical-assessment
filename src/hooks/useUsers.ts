import { UserT } from '../types/auth';
import { apiClient } from '../utils/client';
import { useQuery } from '@tanstack/react-query';

export const useFetchUsers = () => {
  return useQuery<UserT[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/users');
      return response.data;
    },
  });
};
