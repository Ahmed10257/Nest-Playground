import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PostService } from 'src/post/post.service';
import { Post } from 'src/entities/post.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  providers: [UserResolver, UserService, PostService],
})
export class UserModule {}
