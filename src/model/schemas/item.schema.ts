import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { List } from './list.schema';

export type ItemDocument = Item & Document;

@Schema({ timestamps: false, versionKey: false })
export class Item {
  @Prop({
    type: String,
    required: true,
    nullable: false,
  })
  name: string;

  @Prop({
    type: Boolean,
    required: false,
    nullable: false,
    default: false,
  })
  done: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: List.name,
    required: true,
    nullable: false,
  })
  list: ObjectId;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
