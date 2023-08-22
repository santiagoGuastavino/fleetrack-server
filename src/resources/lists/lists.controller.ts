import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Body,
  Req,
  Patch,
  Delete,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { CreateListDto } from './dtos/request/create-list.dto';
import { RenameListDto } from './dtos/request/rename-list.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DeleteListDto } from './dtos/request/delete-list.dto';
import { IList } from 'src/model/interfaces/list.interface';
import { UserExistsInterceptor } from 'src/common/interceptors/user-exists.interceptor';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserExistsInterceptor)
  async createList(
    @Body() payload: CreateListDto,
    @Req() req: any,
  ): Promise<ResponseDto<object>> {
    const jwtPayload: JwtPayload = req.user;

    try {
      const response: ResponseDto<object> = await this.listsService.createList(
        payload,
        jwtPayload,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserExistsInterceptor)
  async renameList(
    @Body() payload: RenameListDto,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const jwtPayload: JwtPayload = req.user;

    try {
      const response: ResponseDto<object> = await this.listsService.renameList(
        payload,
        jwtPayload,
        i18n,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserExistsInterceptor)
  async deleteList(
    @Body() payload: DeleteListDto,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const jwtPayload: JwtPayload = req.user;

    try {
      const response: ResponseDto<object> = await this.listsService.deleteList(
        payload,
        jwtPayload,
        i18n,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserExistsInterceptor)
  async getListsByUser(@Req() req: any): Promise<ResponseDto<IList[]>> {
    const jwtPayload: JwtPayload = req.user;

    try {
      const response: ResponseDto<IList[]> =
        await this.listsService.getListsByUser(jwtPayload);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
