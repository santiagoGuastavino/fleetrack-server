import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

type Entities = 'list';
type Actions = 'edit' | 'delete';

export class ResourceAccessDeniedException extends HttpException {
  constructor(i18n: I18nContext, entity: Entities, action: Actions) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
        errors: [
          {
            children: [],
            constraints: {
              FORBIDDEN: i18n.t('exceptions.FORBIDDEN', {
                args: {
                  entity,
                  action,
                },
              }),
            },
          },
        ],
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
