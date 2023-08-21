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
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { CreateListDto } from './dtos/request/create-list.dto';
import { RenameListDto } from './dtos/request/rename-list.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DeleteListDto } from './dtos/request/delete-list.dto';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
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
}
