import { useEffect } from 'react';
import {
  Button,
  Label,
  Input,
  Form,
  Heading,
  TextField,
} from 'react-aria-components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { InvitationT, InvitationFormInputsT } from '../../../types/invitation';
import { useUpdateInvitation } from '../../../hooks/useInvitations';
import { invitationFormSchema } from '../../../schemas/invitation';

type UpdateInvitationDialogProps = {
  invitation: InvitationT;
  isOpen: boolean;
  onClose: () => void;
};

/*
I implemented this feature as a modal instead of expanding the UI for each invitation.
This approach provides a more consistent user experience, because we will display multiple invitations below.
*/
const UpdateInvitationDialog = ({
  invitation,
  isOpen,
  onClose,
}: UpdateInvitationDialogProps) => {
  const { mutateAsync: updateInvitation, isPending: isSubmitting } =
    useUpdateInvitation();

  const { control, handleSubmit, watch, setValue } =
    useForm<InvitationFormInputsT>({
      resolver: zodResolver(invitationFormSchema),
      defaultValues: {
        ...invitation,
      },
    });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.startsWith('write') && value[name]) {
        const readPermission = name.replace(
          'write',
          'read'
        ) as keyof InvitationFormInputsT;
        setValue(readPermission, true);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onSubmit = async (data: InvitationFormInputsT) => {
    const hasAnyPermission = Object.values(data).some(
      (value) => typeof value === 'boolean' && value
    );

    if (!hasAnyPermission) {
      toast.error('Please select at least one permission.');
      return;
    }

    try {
      await updateInvitation({ id: invitation.id, data });
      onClose();
      toast.success('Invitation updated successfully');
    } catch (error) {
      toast.error('Failed to update invitation');
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
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <Heading
            id="update-dialog-title"
            slot="title"
            className="text-lg font-medium mb-1"
          >
            Edit Invitation
          </Heading>
          <p className="text-sm text-gray-500 mb-6">
            Modify permissions for this invitation.
          </p>

          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TextField className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </Label>
              <input
                value={invitation.reviewer}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-default"
                aria-label="Invited user email"
              />
            </TextField>

            <fieldset className="space-y-4" disabled={isSubmitting}>
              <legend className="text-sm font-medium text-gray-700">
                Permissions
              </legend>
              <div
                className="grid grid-cols-2 gap-4"
                role="group"
                aria-label="Permission settings"
              >
                {[
                  { read: 'readPost', write: 'writePost', label: 'Post' },
                  {
                    read: 'readMessage',
                    write: 'writeMessage',
                    label: 'Message',
                  },
                  {
                    read: 'readProfile',
                    write: 'writeProfile',
                    label: 'Profile',
                  },
                ].map(({ read, write, label }) => (
                  <div key={read} className="space-y-3">
                    <Controller
                      name={read as keyof InvitationFormInputsT}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <Input
                              type="checkbox"
                              checked={Boolean(value)}
                              onChange={(e) => onChange(e.target.checked)}
                              disabled={
                                isSubmitting ||
                                Boolean(
                                  watch(write as keyof InvitationFormInputsT)
                                )
                              }
                              className="sr-only peer"
                              aria-label={`Read ${label} permission`}
                            />
                            <div
                              className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-900 ${
                                watch(write as keyof InvitationFormInputsT)
                                  ? 'bg-gray-900 cursor-not-allowed'
                                  : 'bg-gray-200 peer-checked:bg-gray-900'
                              }`}
                            />
                            <span className="ml-3 text-sm">Read {label}</span>
                          </label>
                        </div>
                      )}
                    />
                    <Controller
                      name={write as keyof InvitationFormInputsT}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <Input
                              type="checkbox"
                              checked={Boolean(value)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                onChange(checked);
                                if (checked) {
                                  setValue(
                                    read as keyof InvitationFormInputsT,
                                    true
                                  );
                                }
                              }}
                              disabled={isSubmitting}
                              className="sr-only peer"
                              aria-label={`Write ${label} permission`}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-focus:outline-none peer-focus:ring-2 focus:ring-gray-900" />
                            <span className="ml-3 text-sm">Write {label}</span>
                          </label>
                        </div>
                      )}
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="pt-4 flex justify-end space-x-4">
              <Button
                onPress={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isDisabled={isSubmitting}
                className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                {isSubmitting ? 'Updating...' : 'Update Invitation'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvitationDialog;
