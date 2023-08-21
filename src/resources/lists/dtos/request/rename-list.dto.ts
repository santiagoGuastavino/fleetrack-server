import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ObjectId } from 'mongodb';

export class RenameListDto {
  @IsMongoId({ message: i18nValidationMessage('dto.IS_MONGO_ID') })
  @IsNotEmpty({ message: i18nValidationMessage('dto.IS_NOT_EMPTY') })
  id: ObjectId;

  @IsString({ message: i18nValidationMessage('dto.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('dto.IS_NOT_EMPTY') })
  name: string;
}
