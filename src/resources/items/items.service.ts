import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { IItem } from 'src/model/interfaces/item.interface';
import { Item } from 'src/model/schemas/item.schema';
import { SaveItemDto } from './dtos/save-item.dto';
import { CreateItemDto } from './dtos/request/create-item.dto';
import { ResponseDto, ResponseMessage } from 'src/common/dtos/response.dto';
import { RenameItemDto } from './dtos/request/rename-item.dto';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { I18nContext } from 'nestjs-i18n';
import { DeleteItemDto } from './dtos/request/delete-item.dto';
import { GetItemsByListDto } from './dtos/request/get-items-by-list.dto';
import { ChangeItemStatusDto } from './dtos/request/change-item-status.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemsModel: Model<Item>,
  ) {}

  public async createItem(
    payload: CreateItemDto,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(
      HttpStatus.CREATED,
      ResponseMessage.CREATED,
    );

    const newItem = new SaveItemDto(payload.name, payload.list);

    await this.insert(newItem);

    return response;
  }

  public async renameItem(
    payload: RenameItemDto,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(HttpStatus.OK, ResponseMessage.OK);

    const itemToUpdate = await this.findOne({ _id: payload._id });

    if (!itemToUpdate) throw new NotFoundException(i18n, 'item');

    await this.updateOne({ _id: itemToUpdate._id }, { name: payload.name });

    return response;
  }

  public async deleteItem(
    payload: DeleteItemDto,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(HttpStatus.OK, ResponseMessage.OK);

    const itemToUpdate = await this.findOne({ _id: payload._id });

    if (!itemToUpdate) throw new NotFoundException(i18n, 'item');

    await this.deleteOne({ _id: payload._id });

    return response;
  }

  public async getItemsByList(
    payload: GetItemsByListDto,
  ): Promise<ResponseDto<IItem[]>> {
    const response = new ResponseDto<IItem[]>(
      HttpStatus.OK,
      ResponseMessage.OK,
    );

    const itemsByList: IItem[] = await this.findMany({ list: payload.list });

    response.payload = itemsByList;

    return response;
  }

  public async changeItemStatus(
    payload: ChangeItemStatusDto,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(HttpStatus.OK, ResponseMessage.OK);

    const itemToUpdate = await this.findOne({ _id: payload._id });

    if (!itemToUpdate) throw new NotFoundException(i18n, 'item');

    await this.updateOne(
      { _id: itemToUpdate._id },
      { done: !itemToUpdate.done },
    );

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
  ): Promise<void> {
    await this.itemsModel.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
  }

  private async deleteOne(filter: FilterQuery<Item>): Promise<void> {
    await this.itemsModel.deleteOne(filter);
  }
}
