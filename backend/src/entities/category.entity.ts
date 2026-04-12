import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Course } from './course.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  category_title: string;

  @Column({ name: 'category_slug', unique: true })
  category_slug: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  parent_id: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  banner_images: string;

  @Column({ type: 'text', nullable: true })
  short_desc: string;

  @Column({ type: 'longtext', nullable: true })
  long_desc: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToMany(() => Course, course => course.category)
  courses: Course[];
}
