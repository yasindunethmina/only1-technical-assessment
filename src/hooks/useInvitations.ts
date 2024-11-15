import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '../utils/client';
import {
  InvitationT,
  InvitationPayloadT,
  InvitationResponseT,
  UpdateInvitationPayloadT,
} from '../types/invitation';
import {
  createEntityTimestamps,
  buildQueryString,
  createBaseQueryParams,
} from '../utils/api-utils';
import sortByNewest from '../utils/sortInvitations';

const INVITATIONS_QUERY_KEY = ['invitations'] as const;
const ALL_INVITATIONS_QUERY_KEY = ['all-invitations'] as const;

// Fetch all invitations
export const useFetchAllInvitations = (params: {
  owner?: string;
  reviewer?: string;
}) => {
  return useQuery({
    queryKey: [...ALL_INVITATIONS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await apiClient.get<InvitationT[]>('/invitations');

      // Filter and sort all invitations
      return response.data
        .filter((invitation) =>
          Object.entries(params).every(
            ([key, value]) => invitation[key as keyof InvitationT] === value
          )
        )
        .sort(sortByNewest);
    },
    staleTime: 0,
  });
};

// Fetch invitations (with pagination)
export const useFetchInvitations = (params: {
  owner?: string;
  reviewer?: string;
  limit: number;
}) => {
  const query = useInfiniteQuery({
    queryKey: [...INVITATIONS_QUERY_KEY, params],
    queryFn: async ({ pageParam = 1 }) => {
      // Simulate loading delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { limit, ...restParams } = params;
      const start = (pageParam - 1) * limit;

      // Get all invitations first for accurate filtering and sorting
      const response = await apiClient.get<InvitationT[]>('/invitations');

      // NOTE: For large datasets, this in-memory sorting of all items could be inefficient.
      // A more optimized approach would be to:
      // Only sort the new chunks as they arrive from infiniteQuery
      // However, for our simple local db.json case, this approach is sufficient :)
      const filteredInvitations = response.data
        .filter((invitation) =>
          Object.entries(restParams).every(
            ([key, value]) => invitation[key as keyof InvitationT] === value
          )
        )
        .sort(sortByNewest);

      const totalInvitations = filteredInvitations.length;
      const paginatedInvitations = filteredInvitations.slice(
        start,
        start + limit
      );
      const hasMore = start + paginatedInvitations.length < totalInvitations;

      return {
        invitations: paginatedInvitations,
        total: totalInvitations,
        hasMore,
        nextPage: hasMore ? pageParam + 1 : null,
      } as InvitationResponseT;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allInvitations =
    query.data?.pages.flatMap((page) => page.invitations) ?? [];
  const totalCount = query.data?.pages[0]?.total ?? 0;

  return {
    invitations: allInvitations,
    total: totalCount,
    isLoading: query.isLoading,
    error: query.error,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InvitationPayloadT) => {
      const existingResponse =
        await apiClient.get<InvitationT[]>('/invitations');

      const hasExistingInvitation = existingResponse.data.some(
        (invitation) =>
          invitation.owner === payload.owner &&
          invitation.reviewer === payload.reviewer
      );

      if (hasExistingInvitation) {
        throw new Error(
          'Cannot create new invitation: An invitation already exists for this user'
        );
      }

      const invitation = {
        ...payload,
        ...createEntityTimestamps(),
      };

      const response = await apiClient.post<InvitationT>(
        '/invitations',
        invitation
      );
      return response.data;
    },
    onSuccess: (newInvitation) => {
      queryClient.setQueriesData(
        { queryKey: ALL_INVITATIONS_QUERY_KEY },
        (old: InvitationT[] = []) => [newInvitation, ...old]
      );

      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_INVITATIONS_QUERY_KEY });

      toast.success('Invitation created successfully');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create invitation'
      );
    },
  });
};

export const useUpdateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateInvitationPayloadT) => {
      const existingResponse = await apiClient.get<InvitationT[]>(
        `/invitations?${buildQueryString({ id, ...createBaseQueryParams({}) })}`
      );

      if (!existingResponse.data[0]) {
        throw new Error('Invitation not found');
      }

      const updatedInvitation = {
        ...existingResponse.data[0],
        ...data,
        ...createEntityTimestamps(true),
      };

      // Ensure read permissions are true when write permissions are true
      if (updatedInvitation.writePost) updatedInvitation.readPost = true;
      if (updatedInvitation.writeMessage) updatedInvitation.readMessage = true;
      if (updatedInvitation.writeProfile) updatedInvitation.readProfile = true;

      const response = await apiClient.put<InvitationT>(
        `/invitations/${id}`,
        updatedInvitation
      );
      return response.data;
    },
    onSuccess: (updatedInvitation) => {
      queryClient.setQueriesData(
        { queryKey: ALL_INVITATIONS_QUERY_KEY },
        (old: InvitationT[] = []) => {
          const filtered = old.filter((inv) => inv.id !== updatedInvitation.id);
          return [updatedInvitation, ...filtered].sort(sortByNewest);
        }
      );

      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_INVITATIONS_QUERY_KEY });

      toast.success('Invitation updated successfully');
    },
    onError: () => {
      toast.error('Failed to update invitation');
    },
  });
};

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/invitations/${id}`);
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: ALL_INVITATIONS_QUERY_KEY },
        (old: InvitationT[] = []) => old.filter((inv) => inv.id !== deletedId)
      );

      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_INVITATIONS_QUERY_KEY });

      toast.success('Invitation deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete invitation');
    },
  });
};
