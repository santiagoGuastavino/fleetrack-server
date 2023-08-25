import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateItemDto } from './dtos/request/create-item.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserExistsAndOwnsListInterceptor } from './interceptors/user-exists-and-owns-list.interceptor';
import { RenameItemDto } from './dtos/request/rename-item.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DeleteItemDto } from './dtos/request/delete-item.dto';
import { IItem } from 'src/model/interfaces/item.interface';
import { GetItemsByListDto } from './dtos/request/get-items-by-list.dto';
import { ChangeItemStatusDto } from './dtos/request/change-item-status.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserExistsAndOwnsListInterceptor)
  async createItem(
    @Body() payload: CreateItemDto,
  ): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> =
        await this.itemsService.createItem(payload);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserExistsAndOwnsListInterceptor)
  async renameItem(
    @Body() payload: RenameItemDto,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> = await this.itemsService.renameItem(
        payload,
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
  @UseInterceptors(UserExistsAndOwnsListInterceptor)
  async deleteItem(
    @Body() payload: DeleteItemDto,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> = await this.itemsService.deleteItem(
        payload,
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
  @UseInterceptors(UserExistsAndOwnsListInterceptor)
  async getItemsByList(
    @Body() payload: GetItemsByListDto,
  ): Promise<ResponseDto<IItem[]>> {
    try {
      const response: ResponseDto<IItem[]> =
        await this.itemsService.getItemsByList(payload);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Patch('status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserExistsAndOwnsListInterceptor)
  async changeItemStatus(
    @Body() payload: ChangeItemStatusDto,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> =
        await this.itemsService.changeItemStatus(payload, i18n);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
