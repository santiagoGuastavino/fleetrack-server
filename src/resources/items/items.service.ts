import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { IItem } from 'src/model/interfaces/item.interface';
import { Item } from 'src/model/schemas/item.schema';
import { SaveItemDto } from './dtos/save-item.dto';
import { CreateItemDto } from './dtos/request/create-item.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { I18nContext } from 'nestjs-i18n';
import { ResponseDto, ResponseMessage } from 'src/common/dtos/response.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemsModel: Model<Item>,
  ) {}

  public async createItem(
    payload: CreateItemDto,
    jwtPayload: JwtPayload,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(
      HttpStatus.CREATED,
      ResponseMessage.CREATED,
    );

    // const userToCreateList: IUser = await this.usersService.findOne({
    //   _id: jwtPayload._id,
    // });

    // if (!userToCreateList) throw new NotFoundException(i18n, 'user');

    return response;
  }

  private async insert(payload: SaveItemDto): Promise<void> {
    await this.itemsModel.create(payload);
  }

  private async findOne(filter: FilterQuery<Item>): Promise<IItem> {
    return await this.itemsModel.findOne(filter).lean();
  }

  private async findMany(filter: FilterQuery<Item>): Promise<IItem[]> {
    return await this.itemsModel.find(filter).lean();
  }

  private async updateOne(
    filter: FilterQuery<Item>,
    update: UpdateQuery<Item>,
  ) {
    await this.itemsModel.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
  }

  private async deleteOne(filter: FilterQuery<Item>): Promise<void> {
    await this.itemsModel.deleteOne(filter);
  }
}
