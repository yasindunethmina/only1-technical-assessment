import { useEffect, useMemo, useState } from 'react';
import { Button, Label, Input, Form, Heading } from 'react-aria-components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import {
  InvitationFormInputsT,
  InvitationPayloadT,
  InvitationStatus,
} from '../../../types/invitation';
import {
  useFetchInvitations,
  useCreateInvitation,
} from '../../../hooks/useInvitations';
import { shortenEmail } from '../../../utils/shortenEmail';
import { useFetchUsers } from '../../../hooks/useUsers';
import { invitationFormSchema } from '../../../schemas/invitation';

type CreateInvitationDialogProps = {
  owner: string;
};

const CreateInvitationDialog = ({ owner }: CreateInvitationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { invitations } = useFetchInvitations({ owner, limit: 10 });
  const { data: users = [], isLoading: isLoadingUsers } = useFetchUsers();
  const { mutateAsync: createInvitation, isPending: isSubmitting } =
    useCreateInvitation();

  /*
  We could use the formState provided by react-hook-form to handle form errors more comprehensively.
  However, given the simplicity of our current form setup and the specific error handling requirements,
  the existing implementation should suffice for now.
*/
  const { control, setValue, handleSubmit, reset, watch } =
    useForm<InvitationFormInputsT>({
      resolver: zodResolver(invitationFormSchema),
      defaultValues: {
        reviewer: '',
        owner: owner,
        readPost: false,
        writePost: false,
        readMessage: false,
        writeMessage: false,
        readProfile: false,
        writeProfile: false,
        expireInDays: 7,
      },
    });

  // Filter the user reviewer
  const availableUsers = useMemo(
    () =>
      users.filter(({ email }: { email: string }) => {
        const excludeList = [
          owner,
          ...invitations.map(({ reviewer }) => reviewer),
        ];
        return !excludeList.includes(email);
      }),
    [users, owner, invitations]
  );

  // Watch write permissions to handle read permissions automatically
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

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = async (data: InvitationFormInputsT) => {
    const hasAnyPermission = Object.values(data).some(
      (value) => typeof value === 'boolean' && value
    );

    if (!hasAnyPermission) {
      toast.error('Please select at least one permission.');
      return;
    }

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + data.expireInDays);

      const payload: InvitationPayloadT = {
        ...data,
        expiresAt: expiresAt.toISOString(),
        status: InvitationStatus.PENDING,
      };

      await createInvitation(payload);
      handleClose();
    } catch (error) {
      toast.error('Failed to create invitation');
    }
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-md text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        New Invitation
      </Button>

      {isOpen && (
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
              onClick={handleClose}
            />
            <div
              className="relative bg-white rounded-lg w-full max-w-md p-6 mx-4 shadow-xl"
              role="document"
            >
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                type="button"
                className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <Heading
                id="create-dialog-title"
                slot="title"
                className="text-lg font-medium mb-1"
              >
                Send Invitation
              </Heading>

              <p className="text-sm text-gray-500 mb-6">
                Invite a new user and set their permissions.
              </p>

              <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </Label>
                  <Controller
                    name="reviewer"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={isSubmitting}
                        aria-label="Select user"
                      >
                        <option disabled={true} value="">
                          Select a user
                        </option>
                        {isLoadingUsers ? (
                          <option disabled>Loading users...</option>
                        ) : availableUsers.length > 0 ? (
                          availableUsers.map((user) => (
                            <option
                              key={user.id}
                              value={user.email}
                              className="cursor-pointer"
                            >
                              {shortenEmail(user.email, 20)}
                            </option>
                          ))
                        ) : (
                          <option value="">No users available</option>
                        )}
                      </select>
                    )}
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Expire At (Days)
                  </Label>
                  <Controller
                    name="expireInDays"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Expiration days"
                      />
                    )}
                  />
                </div>

                <fieldset className="space-y-4" disabled={isSubmitting}>
                  <legend className="text-sm font-medium text-gray-700">
                    Permissions
                  </legend>
                  <div
                    className="grid grid-cols-2 gap-2 sm:gap-4"
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
                                      watch(
                                        write as keyof InvitationFormInputsT
                                      )
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
                                <span className="ml-2 sm:ml-3 text-xs sm:text-sm">
                                  Read {label}
                                </span>
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
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-900" />
                                <span className="ml-2 sm:ml-3 text-xs sm:text-sm">
                                  Write {label}
                                </span>
                              </label>
                            </div>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className="pt-4">
                  <Button
                    type="submit"
                    isDisabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-2 rounded-md text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    {isSubmitting ? 'Loading...' : 'Send Invitation'}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateInvitationDialog;
