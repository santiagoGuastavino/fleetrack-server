import { Controller, HttpStatus, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from './common/dtos/response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async wake(): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> = await this.appService.wake();

      return response;
    } catch (error) {
      throw error;
    }
  }
}
