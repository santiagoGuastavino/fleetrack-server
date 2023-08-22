import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/resources/users/users.service';
import { IUser } from 'src/model/interfaces/user.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class UserExistsInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const jwtPayload: JwtPayload = req.user;

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

    return next.handle();
  }
}
