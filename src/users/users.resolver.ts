import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRoles } from './dto/args/roles.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRolesEnum } from 'src/auth/enums/valid-roles.enum';
import { ItemsService } from 'src/items/items.service';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { Item } from 'src/items/entities/item.entity';
import { ListsService } from 'src/lists/lists.service';
import { List } from 'src/lists/entities/list.entity';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listService: ListsService
    ) {}


  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRoles,
    @Args() paginationArgs: PaginationArgs,
    @Args() searcArgs: SearchArgs,
    @CurrentUser([ValidRolesEnum.admin, ValidRolesEnum.superUser]) user: User
  ): Promise<User[]> {

    return this.usersService.findAll( validRoles.roles, paginationArgs, searcArgs );
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRolesEnum.admin, ValidRolesEnum.superUser]) user: User
    ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, {name: 'updateUser'})
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRolesEnum.admin]) user: User
    ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }


  @Mutation(() => User, {name: 'blockUser'})
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRolesEnum.admin]) user: User
    ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, {name: 'itemCount'})
  async itemCount(
    @CurrentUser([ValidRolesEnum.admin]) adminUser: User,
    @Parent() user: User
  ): Promise<Number> {
   return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], {name: 'items'})
  async getItemsByUsers(
    @CurrentUser([ValidRolesEnum.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
   return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, {name: 'listCount'})
  async listCount(
    @CurrentUser([ValidRolesEnum.admin]) adminUser: User,
    @Parent() user: User
  ): Promise<Number> {
   return this.listService.listCountByUser(user);
  }

  @ResolveField(() => [List], {name: 'list'})
  async getListsByUsers(
    @CurrentUser([ValidRolesEnum.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
   return this.listService.findAll(user, paginationArgs, searchArgs);
  }

}
