import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDto, ResponseMessage } from 'src/common/dtos/response.dto';
import { List } from 'src/model/schemas/list.schema';

@Injectable()
export class ListsService {
  constructor(@InjectModel(List.name) private listsModel: Model<List>) {}

  public async createList(): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(
      HttpStatus.CREATED,
      ResponseMessage.CREATED,
    );

    return response;
  }
}
