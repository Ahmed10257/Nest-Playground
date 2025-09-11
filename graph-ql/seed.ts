import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from './src/entities/user.entity';
import { Profile } from './src/entities/profile.entity';
import { Post } from './src/entities/post.entity';
import { Tag } from './src/entities/tag.entity';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Profile, Post, Tag],
  synchronize: true,
});

console.log({ DATABASE_URL: process.env.DATABASE_URL });

async function seed() {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const profileRepository = dataSource.getRepository(Profile);
  const postRepository = dataSource.getRepository(Post);
  const tagRepository = dataSource.getRepository(Tag);

  // Create and save tags first
  const tags: Tag[] = [];
  for (let i = 0; i < 5; i++) {
    const tag = tagRepository.create({ name: faker.word.noun() });
    const savedTag = await tagRepository.save(tag);
    tags.push(savedTag);
  }

  // Create users with profiles
  for (let i = 0; i < 10; i++) {
    // Create and save profile first
    const profile = profileRepository.create({
      bio: faker.lorem.sentence(),
      avatar: faker.image.avatar(),
    });
    const savedProfile = await profileRepository.save(profile);

    // Create user
    const user = new User({
      username: faker.internet.username(),
      email: faker.internet.email(),
    });
    const savedUser = await userRepository.save(user);

    // Update user with profile relationship
    await userRepository
      .createQueryBuilder()
      .relation(User, 'profile')
      .of(savedUser)
      .set(savedProfile);

    // Create posts for this user
    for (let j = 0; j < 10; j++) {
      const post = postRepository.create({
        title: faker.lorem.words(5),
        content: faker.lorem.paragraph(),
      });
      const savedPost = await postRepository.save(post);

      // Set user relationship
      await postRepository
        .createQueryBuilder()
        .relation(Post, 'user')
        .of(savedPost)
        .set(savedUser);

      // Set tags relationship
      await postRepository
        .createQueryBuilder()
        .relation(Post, 'tags')
        .of(savedPost)
        .add(faker.helpers.arrayElements(tags));
    }
  }

  console.log('Database seeding completed!');
  await dataSource.destroy();
}

seed().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
