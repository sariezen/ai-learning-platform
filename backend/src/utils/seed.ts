import { AppDataSource } from '../config/database';
import { Category } from '../models/category.entity';
import { SubCategory } from '../models/sub-category.entity';
import { User } from '../models/user.entity';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedData = [
  {
    name: 'Science',
    subs: ['Space', 'Physics', 'Biology', 'Chemistry'],
  },
  {
    name: 'Technology',
    subs: ['AI & Machine Learning', 'Web Development', 'Cybersecurity', 'Cloud Computing'],
  },
  {
    name: 'Mathematics',
    subs: ['Algebra', 'Calculus', 'Statistics', 'Geometry'],
  },
  {
    name: 'History',
    subs: ['Ancient History', 'World Wars', 'Middle Ages', 'Modern History'],
  },
  {
    name: 'Languages',
    subs: ['English Grammar', 'Hebrew', 'Spanish', 'French'],
  },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected. Seeding...');

  const categoryRepo = AppDataSource.getRepository(Category);
  const subCategoryRepo = AppDataSource.getRepository(SubCategory);
  const userRepo = AppDataSource.getRepository(User);

  for (const cat of seedData) {
    let category = await categoryRepo.findOne({ where: { name: cat.name } });
    if (!category) {
      category = await categoryRepo.save(categoryRepo.create({ name: cat.name }));
      console.log(`  Created category: ${cat.name}`);
    }

    for (const subName of cat.subs) {
      const existing = await subCategoryRepo.findOne({
        where: { name: subName, category_id: category.id },
      });
      if (!existing) {
        await subCategoryRepo.save(
          subCategoryRepo.create({ name: subName, category_id: category.id })
        );
        console.log(`    Created sub-category: ${subName}`);
      }
    }
  }

  const adminEmail = 'admin@learning.com';
  const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepo.save(
      userRepo.create({
        name: 'Admin',
        phone: '0500000000',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      })
    );
    console.log('  Created admin user: admin@learning.com / admin123');
  }

  console.log('Seeding complete!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
