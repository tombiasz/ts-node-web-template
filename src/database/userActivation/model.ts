export type UserActivationModel = {
  userId: string;
  token: string;
  createdAt: Date;
  usedOn: Date | null;
};
