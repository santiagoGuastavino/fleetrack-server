import { ObjectId } from 'mongodb';
import { Lists } from 'src/common/enums/lists.enum';

export interface IList {
  _id: ObjectId;
  type: Lists;
  user: ObjectId;
}
