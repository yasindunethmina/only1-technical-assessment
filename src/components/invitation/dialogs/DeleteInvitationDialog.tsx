import { Button, Heading } from 'react-aria-components';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { useDeleteInvitation } from '../../../hooks/useInvitations';
import { InvitationT } from '../../../types/invitation';
import { shortenEmail } from '../../../utils/shortenEmail';

type DeleteInvitationDialogProps = {
  invitation: InvitationT;
  isOpen: boolean;
  onClose: () => void;
};

const DeleteInvitationDialog = ({
  invitation,
  isOpen,
  onClose,
}: DeleteInvitationDialogProps) => {
  const { mutateAsync: deleteInvitation, isPending } = useDeleteInvitation();

  const handleDelete = async () => {
    try {
      await deleteInvitation(invitation.id);
      onClose();
    } catch (error) {
      toast.error('Failed to cancel invitation');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="fixed inset-0 bg-black/25"
          aria-hidden="true"
          onClick={onClose}
        />
        <div
          className="relative bg-white rounded-lg w-full max-w-md p-6 mx-4 shadow-xl"
          role="document"
        >
          <Button
            onPress={onClose}
            isDisabled={isPending}
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>

          <Heading
            id="delete-dialog-title"
            slot="title"
            className="text-lg font-medium mb-4"
          >
            Cancel Invitation
          </Heading>

          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to cancel the invitation sent to{' '}
            <span className="font-medium text-gray-900">
              {shortenEmail(invitation.reviewer, 20)}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-4">
            <Button
              onPress={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Cancel
            </Button>
            <Button
              onPress={handleDelete}
              isDisabled={isPending}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isPending ? 'Cancelling...' : 'Yes, Cancel Invitation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteInvitationDialog;
