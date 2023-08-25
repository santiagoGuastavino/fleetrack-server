import { IsMongoId, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ObjectId } from 'mongodb';

export class GetItemsByListDto {
  @IsMongoId({ message: i18nValidationMessage('dto.IS_MONGO_ID') })
  @IsNotEmpty({ message: i18nValidationMessage('dto.IS_NOT_EMPTY') })
  list: ObjectId;
}
