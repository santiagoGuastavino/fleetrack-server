import { ObjectId } from 'mongodb';

export interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  passwordRecoveryCode: number;
  lastRefreshToken: number;
}
