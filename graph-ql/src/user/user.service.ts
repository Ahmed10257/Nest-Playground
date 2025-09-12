import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const user = this.userRepo.create(createUserInput);
    return await this.userRepo.save(user);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    return await this.userRepo.findOneByOrFail({ id });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.userRepo.findOneByOrFail({ id });
    return await this.userRepo.save(
      new User(Object.assign(user, updateUserInput)),
    );
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    return result.affected === 1;
  }
}
