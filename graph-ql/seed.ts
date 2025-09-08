import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from './src/entities/user.entity';
import { Profile } from './src/entities/profile.entity';
import { Post } from './src/entities/post.entity';
import { Tag } from './src/entities/tag.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'blog_db',
  entities: [User, Profile, Post, Tag],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const tagRepo = dataSource.getRepository(Tag);
  const userRepo = dataSource.getRepository(User);
  const postRepo = dataSource.getRepository(Post);
  const profileRepo = dataSource.getRepository(Profile);

  // create tags
  const tags = ['tech', 'life', 'food', 'travel'].map(name => {
    const tag = new Tag();
    tag.name = name;
    return tag;
  });
  const savedTags = await tagRepo.save(tags);

  // create users with profiles + posts
  for (let i = 0; i < 5; i++) {
    const user = new User();
    user.username = faker.internet.username();
    user.email = faker.internet.email();

    const profile = new Profile();
    profile.bio = faker.lorem.sentence();
    profile.avatar = faker.image.avatar();

    // Save profile first
    const savedProfile = await profileRepo.save(profile);

    // Assign the saved profile to user
    user.profile = Promise.resolve(savedProfile);

    const savedUser = await userRepo.save(user);

    for (let j = 0; j < 3; j++) {
      const post = new Post();
      post.title = faker.lorem.words(5);
      post.content = faker.lorem.paragraphs(2);
      post.user = Promise.resolve(savedUser);
      post.tags = Promise.resolve(faker.helpers.arrayElements(savedTags, 2));
      await postRepo.save(post);
    }
  }

  console.log('✅ Database seeded');
  await dataSource.destroy();
  process.exit(0);
}

void seed();
