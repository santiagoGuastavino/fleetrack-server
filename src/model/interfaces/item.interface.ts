import { ObjectId } from 'mongodb';

export interface IList {
  _id: ObjectId;
  name: string;
  done: boolean;
  list: ObjectId;
}
