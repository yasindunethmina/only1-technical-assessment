import { InvitationT } from '../types/invitation';

const PERMISSION_LABELS = {
  readPost: 'Read Posts',
  writePost: 'Write Posts',
  readMessage: 'Read Messages',
  writeMessage: 'Write Messages',
  readProfile: 'Read Profile',
  writeProfile: 'Write Profile',
} as const;

const formatPermissions = (invitation: InvitationT): string => {
  return Object.entries(PERMISSION_LABELS)
    .filter(([key]) => invitation[key as keyof InvitationT])
    .map(([, label]) => label)
    .join(', ');
};

export default formatPermissions;
