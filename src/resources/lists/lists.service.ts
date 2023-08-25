import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';
import { ResponseDto, ResponseMessage } from 'src/common/dtos/response.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { List } from 'src/model/schemas/list.schema';
import { CreateListDto } from './dtos/request/create-list.dto';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { SaveListDto } from './dtos/save-list.dto';
import { IList } from 'src/model/interfaces/list.interface';
import { RenameListDto } from './dtos/request/rename-list.dto';
import { ResourceAccessDeniedException } from 'src/common/exceptions/resource-access-denied.exception';
import { DeleteListDto } from './dtos/request/delete-list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(List.name) private readonly listsModel: Model<List>,
  ) {}

  public async createList(
    payload: CreateListDto,
    jwtPayload: JwtPayload,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(
      HttpStatus.CREATED,
      ResponseMessage.CREATED,
    );

    const newList = new SaveListDto(payload.name, payload.type, jwtPayload._id);

    await this.insert(newList);

    return response;
  }

  public async renameList(
    payload: RenameListDto,
    jwtPayload: JwtPayload,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(HttpStatus.OK, ResponseMessage.OK);

    const listToUpdate = await this.findOne({ _id: payload._id });

    if (!listToUpdate) throw new NotFoundException(i18n, 'list');

    if (listToUpdate.user !== jwtPayload._id)
      throw new ResourceAccessDeniedException(i18n, 'list', 'edit');

    await this.updateOne({ _id: listToUpdate._id }, { name: payload.name });

    return response;
  }

  public async deleteList(
    payload: DeleteListDto,
    jwtPayload: JwtPayload,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(HttpStatus.OK, ResponseMessage.OK);

    const listToDelete = await this.findOne({ _id: payload._id });

    if (!listToDelete) throw new NotFoundException(i18n, 'list');

    if (listToDelete.user !== jwtPayload._id)
      throw new ResourceAccessDeniedException(i18n, 'list', 'delete');

    await this.deleteOne({ _id: listToDelete._id });

    return response;
  }

  public async getListsByUser(
    jwtPayload: JwtPayload,
  ): Promise<ResponseDto<IList[]>> {
    const response = new ResponseDto<IList[]>(
      HttpStatus.OK,
      ResponseMessage.OK,
    );

    const listsByUser: IList[] = await this.findMany({ user: jwtPayload._id });

    response.payload = listsByUser;

    return response;
  }

  private async insert(payload: SaveListDto): Promise<void> {
    await this.listsModel.create(payload);
  }

  public async findOne(filter: FilterQuery<List>): Promise<IList> {
    return await this.listsModel.findOne(filter).lean();
  }

  private async findMany(filter: FilterQuery<List>): Promise<IList[]> {
    return await this.listsModel.find(filter).lean();
  }

  private async updateOne(
    filter: FilterQuery<List>,
    update: UpdateQuery<List>,
  ): Promise<void> {
    await this.listsModel.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
  }

  private async deleteOne(filter: FilterQuery<List>): Promise<void> {
    await this.listsModel.deleteOne(filter);
  }
}
