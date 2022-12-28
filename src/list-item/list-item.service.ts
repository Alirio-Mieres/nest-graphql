import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { List } from 'src/lists/entities/list.entity';
import { Repository } from 'typeorm';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>
  ){}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;
    const newListItem = this.listItemRepository.create({
      ...rest,
      item: {id: itemId},
      list: {id: listId}
    });
    
    return this.listItemRepository.save(newListItem);
  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository.createQueryBuilder('listItems')
      .innerJoin('listItems.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, {listId: list.id});

      if( search ) {
        queryBuilder.andWhere(`LOWER(item.name) like :name`, {name: `%${search.toLowerCase()}%`});
      }

      return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({id});
    if( !listItem ) throw new NotFoundException('List item not found');
    
    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { id: listItemId, itemId, listId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .update()
      .set(rest)
      .where(`"id" = :id`, {id})

      if( listId ) queryBuilder.set({list: {id: listId}});
      if( itemId ) queryBuilder.set({item: {id: itemId}});

    await queryBuilder.execute();

    return await this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async countListItemByList(list: List): Promise<number> {
      return await this.listItemRepository.count({
        where: {list: {id: list.id}}
      });
  }
}
