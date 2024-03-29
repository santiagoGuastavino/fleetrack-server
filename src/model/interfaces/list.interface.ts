import { ObjectId } from 'mongodb';
import { Lists } from 'src/common/enums/lists.enum';

export interface IList {
  _id: ObjectId;
  name: string;
  type: Lists;
  user: ObjectId;
}
