import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from 'src/model/schemas/item.schema';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { UsersModule } from '../users/users.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    UsersModule,
    ListsModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
