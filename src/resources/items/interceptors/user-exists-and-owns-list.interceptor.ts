import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { UsersService } from 'src/resources/users/users.service';
import { IUser } from 'src/model/interfaces/user.interface';
import { ListsService } from 'src/resources/lists/lists.service';
import { IList } from 'src/model/interfaces/list.interface';

@Injectable()
export class UserExistsAndOwnsListInterceptor implements NestInterceptor {
  constructor(
    private readonly userService: UsersService,
    private readonly listsService: ListsService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const jwtPayload: JwtPayload = req.user;
    const requestBody: any = req.body;

    const userExists: IUser = await this.userService.findOne({
      _id: jwtPayload._id,
    });

    if (!userExists)
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not Found',
          errors: [
            {
              entity: 'user',
              children: [],
              constraints: {
                NOT_FOUND: 'The provided user was not found.',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );

    if (!requestBody.list)
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Bad Request',
          errors: [
            {
              property: 'list',
              children: [],
              constraints: {
                isNotEmpty: 'list should not be empty.',
                isMongoId: 'list must be a mongodb id.',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );

    const list: IList = await this.listsService.findOne({
      _id: requestBody.list,
    });

    if (!list)
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not Found',
          errors: [
            {
              entity: 'list',
              children: [],
              constraints: {
                NOT_FOUND: 'The provided list was not found.',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );

    if (String(list.user) !== String(userExists._id))
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Forbidden',
          errors: [
            {
              entity: 'list',
              children: [],
              constraints: {
                FORBIDDEN:
                  'You do not have permission to perform this action on the requested resource.',
              },
            },
          ],
        },
        HttpStatus.FORBIDDEN,
      );

    return next.handle();
  }
}
