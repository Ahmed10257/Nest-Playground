import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [UserModule, PostModule, ProfileModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
