import { InvitationT } from '@/types/invitation';

const sortByNewest = (a: InvitationT, b: InvitationT) => {
  const aTime = new Date(b.createdAt).getTime();
  const bTime = new Date(a.createdAt).getTime();
  return aTime - bTime;
};

export default sortByNewest;
