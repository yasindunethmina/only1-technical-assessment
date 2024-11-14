export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type InvitationT = {
  id: string;
  owner: string;
  reviewer: string;
  status: 'pending' | 'accepted' | 'rejected';
  expiresAt: string;
  createdAt: string;
  updatedAt: string | null;
};

export type InvitationFormInputsT = {
  reviewer: string;
  readPost: boolean;
  writePost: boolean;
  readMessage: boolean;
  writeMessage: boolean;
  readProfile: boolean;
  writeProfile: boolean;
  expireInDays: number;
  owner: string;
};

export type InvitationPayloadT = {
  reviewer: string;
  owner: string;
  readPost: boolean;
  writePost: boolean;
  readMessage: boolean;
  writeMessage: boolean;
  readProfile: boolean;
  writeProfile: boolean;
  expiresAt: string;
  status: InvitationStatus;
};

export type FetchInvitationsParamsT = {
  id?: string;
  reviewer?: string;
  owner?: string;
  page?: number;
  limit?: number;
};

export type InvitationResponseT = {
  invitations: InvitationT[];
  total: number;
  hasMore: boolean;
  nextPage: number | null;
};

export type UpdateInvitationPayloadT = {
  id: string;
  data: Partial<InvitationPayloadT>;
};
