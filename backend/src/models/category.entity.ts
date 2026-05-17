import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { SubCategory } from './sub-category.entity';
import { Prompt } from './prompt.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @OneToMany(() => SubCategory, (sub) => sub.category)
  sub_categories!: SubCategory[];

  @OneToMany(() => Prompt, (prompt) => prompt.category)
  prompts!: Prompt[];
}
