import { Lists } from 'src/common/enums/lists.enum';
import { ObjectId } from 'mongodb';

export class SaveListDto {
  name: string;
  type: Lists;
  user: ObjectId;

  constructor(name: string, type: Lists, user: ObjectId) {
    this.name = name;
    this.type = type;
    this.user = user;
  }
}
