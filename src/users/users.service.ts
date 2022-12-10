import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/singup.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: await bcrypt.hash(signupInput.password, 10),
      });
      return await this.userRepository.save(newUser);
      
    } catch (error) {
      this.handleDBErrors(error);
      
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: string): Promise<User> {
    throw new Error(`No implemented yet!`);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`Block no implemented yet!`);
  }

  private handleDBErrors(error: any): never{
    
    if(error.code === '23505'){
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    
    this.logger.error(error);

    throw new InternalServerErrorException('Please check server errors');
  }
}
