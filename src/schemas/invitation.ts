import { z } from 'zod';

export const invitationFormSchema = z.object({
  reviewer: z.string().email(),
  readPost: z.boolean(),
  writePost: z.boolean(),
  readMessage: z.boolean(),
  writeMessage: z.boolean(),
  readProfile: z.boolean(),
  writeProfile: z.boolean(),
  expireInDays: z.number().min(1),
  owner: z.string(),
});
