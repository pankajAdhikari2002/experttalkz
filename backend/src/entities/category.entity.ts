import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Course } from './course.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  category_title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 0 })
  count: number;

  @OneToMany(() => Course, course => course.category)
  courses: Course[];
}
