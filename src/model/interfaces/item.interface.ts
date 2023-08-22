import { ObjectId } from 'mongodb';

export interface IItem {
  _id: ObjectId;
  name: string;
  done: boolean;
  list: ObjectId;
}
