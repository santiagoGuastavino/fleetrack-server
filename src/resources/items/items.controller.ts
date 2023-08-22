import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateItemDto } from './dtos/request/create-item.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createItem(
    @Body() payload: CreateItemDto,
  ): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> = await this.itemsService.createItem();
    } catch (error) {
      throw error;
    }
  }
}
