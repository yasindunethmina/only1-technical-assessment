import { useState } from 'react';
import {
  Table,
  TableHeader,
  Column,
  Row,
  TableBody,
  Cell,
  Button,
} from 'react-aria-components';

import { InvitationT, InvitationStatus } from '../../types/invitation';
import LoadingSpinner from '../ui/LoadingSpinner';
import {
  useFetchInvitations,
  useUpdateInvitation,
} from '../../hooks/useInvitations';
import useInfiniteScroll from '../../hooks/utils/useInfiniteScroll';
import { shortenEmail } from '../../utils/shortenEmail';
import formatPermissions from '../../utils/formPermissions';

type InvitationReceivedTableProps = {
  email: string;
};

const InvitationReceivedTable = ({ email }: InvitationReceivedTableProps) => {
  const {
    invitations,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    total,
  } = useFetchInvitations({
    reviewer: email,
    limit: 10,
  });

  const { mutate: updateInvitation, isPending: isUpdating } =
    useUpdateInvitation();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadMoreRef = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    hasNextPage,
    isFetchingNextPage
  );

  const handleActionInvitation = async (
    invitation: InvitationT,
    status: InvitationStatus
  ) => {
    try {
      setActionInProgress(invitation.id);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await updateInvitation({
        id: invitation.id,
        data: { status },
      });
    } finally {
      setActionInProgress(null);
    }
  };

  if (error) {
    return (
      <div
        role="alert"
        className="flex justify-center items-center h-48 text-red-500"
      >
        Error loading invitations
      </div>
    );
  }

  if (isLoading && !invitations.length) {
    return (
      <div role="status" className="flex justify-center items-center h-48">
        <LoadingSpinner />
        <span className="sr-only">Loading received invitations...</span>
      </div>
    );
  }

  if (!isLoading && !invitations.length) {
    return (
      <div
        role="status"
        className="flex justify-center items-center h-48 text-gray-500"
      >
        No invitations received
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-auto min-h-20 max-h-[400px]">
        <Table
          aria-label="Received invitations"
          className="w-full min-w-[800px] table-fixed"
        >
          <TableHeader className="bg-white shadow-sm sticky top-0 z-10">
            <Column
              isRowHeader
              className="w-1/5 min-w-[160px] text-left p-4 text-sm font-medium text-gray-500"
            >
              From
            </Column>
            <Column className="w-[15%] min-w-[120px] text-left p-4 text-sm font-medium text-gray-500">
              Status
            </Column>
            <Column className="w-[35%] min-w-[280px] text-left p-4 text-sm font-medium text-gray-500">
              Permissions
            </Column>
            <Column className="w-[15%] min-w-[140px] text-left p-4 text-sm font-medium text-gray-500">
              Expiration
            </Column>
            <Column className="w-[15%] min-w-[100px] text-center p-4 text-sm font-medium text-gray-500">
              Actions
            </Column>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <Row key={invitation.id} className="border-t border-gray-200">
                <Cell className="p-4">
                  <div
                    className="text-sm break-words whitespace-normal line-clamp-2"
                    title={invitation.owner}
                  >
                    {shortenEmail(invitation.owner, 20)}
                  </div>
                </Cell>
                <Cell className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invitation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : invitation.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {invitation.status}
                  </span>
                </Cell>
                <Cell className="p-4">
                  <div
                    className="text-sm text-gray-500 break-words"
                    title={formatPermissions(invitation)}
                  >
                    {formatPermissions(invitation)}
                  </div>
                </Cell>
                <Cell className="p-4">
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(invitation.expiresAt).toLocaleDateString()}
                  </div>
                </Cell>
                <Cell className="p-4">
                  {invitation.status === InvitationStatus.PENDING ? (
                    <div className="flex justify-center items-center space-x-2">
                      <Button
                        aria-label="Accept invitation"
                        onPress={() =>
                          handleActionInvitation(
                            invitation,
                            InvitationStatus.ACCEPTED
                          )
                        }
                        isDisabled={
                          isUpdating || actionInProgress === invitation.id
                        }
                        className="py-1.5 px-3 w-20 h-8 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionInProgress === invitation.id ? (
                          <LoadingSpinner className="w-5 h-5" />
                        ) : (
                          'Accept'
                        )}
                      </Button>
                      <Button
                        aria-label="Reject invitation"
                        onPress={() =>
                          handleActionInvitation(
                            invitation,
                            InvitationStatus.REJECTED
                          )
                        }
                        isDisabled={
                          isUpdating || actionInProgress === invitation.id
                        }
                        className="py-1.5 px-3 w-20 h-8 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-default"
                      >
                        {actionInProgress === invitation.id ? (
                          <LoadingSpinner className="w-5 h-5" />
                        ) : (
                          'Reject'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-center text-gray-500">---</div>
                  )}
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>

        <div
          ref={loadMoreRef}
          className="h-20 flex items-center justify-center border-t border-gray-200"
          role="status"
        >
          {isFetchingNextPage && (
            <>
              <LoadingSpinner />
              <span className="sr-only">Loading more invitations...</span>
            </>
          )}
          {!hasNextPage && invitations.length > 0 && (
            <p className="text-gray-500 text-sm">
              Showing all {invitations.length} of {total} invitations
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationReceivedTable;
