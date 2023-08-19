import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Lists } from 'src/common/enums/lists.enum';
import { User } from './user.schema';

export type ListDocument = List & Document;

@Schema({ timestamps: false, versionKey: false })
export class List {
  @Prop({
    type: String,
    required: true,
    nullable: false,
  })
  name: string;

  @Prop({
    type: String,
    enum: Lists,
    required: true,
    nullable: false,
  })
  type: Lists;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    nullable: false,
  })
  user: ObjectId;
}

export const ListSchema = SchemaFactory.createForClass(List);
