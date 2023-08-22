import { ObjectId } from 'mongodb';

export class SaveItemDto {
  name: string;
  list: ObjectId;

  constructor(name: string, list: ObjectId) {
    this.name = name;
    this.list = list;
  }
}
