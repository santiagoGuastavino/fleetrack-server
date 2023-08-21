import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Lists } from 'src/common/enums/lists.enum';

export class CreateListDto {
  @IsString({ message: i18nValidationMessage('dto.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('dto.IS_NOT_EMPTY') })
  name: string;

  @IsEnum(Lists, {
    message: i18nValidationMessage('dto.IS_ENUM', {
      enum: Object.values(Lists)
        .map((option) => `'${option}'` as string)
        .join(', ')
        .concat('.'),
    }),
  })
  @IsNotEmpty()
  type: Lists;
}
