import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: false, versionKey: false })
export class User {
  @Prop({
    type: String,
    required: true,
    nullable: false,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    nullable: false,
  })
  password: string;

  @Prop({
    type: Number,
    required: true,
    nullable: false,
  })
  passwordRecoveryCode: number;

  @Prop({
    type: Number,
    required: false,
    nullable: true,
    default: null,
  })
  lastRefreshToken: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
