import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createList(): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> =
        await this.listsService.createList();

      return response;
    } catch (error) {
      throw error;
    }
  }
}
