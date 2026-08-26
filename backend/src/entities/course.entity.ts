import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { CourseInstallment } from './course-installment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  course_name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  short_description: string;

  @Column('longtext', { nullable: true })
  long_description: string;

  @Column('text', { nullable: true })
  learnings: string; // JSON string: ["Point 1", "Point 2", ...]

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount_price: number;

  @Column('varchar', { length: 255, nullable: true })
  course_duration: string;

  @Column({ type: 'enum', enum: ['online', 'offline', 'hybrid'], default: 'online' })
  course_mode: string;

  @Column({ type: 'enum', enum: ['basic', 'intermediate', 'advanced'], default: 'basic' })
  course_type: string;

  @Column('varchar', { length: 500, nullable: true })
  thumbnail: string;

  @Column('varchar', { length: 500, nullable: true })
  banner_images: string;

  @Column('varchar', { length: 250, nullable: true })
  syllabus_file: string;

  @Column('int', { nullable: true })
  content_hour: number;

  @Column({ type: 'tinyint', default: 0 })
  is_free: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'tinyint', default: 0 })
  is_featured: number;

  @Column({ type: 'int', default: 0 })
  sorting_order: number;

  @ManyToOne(() => Category, category => category.courses, { nullable: true, eager: true })
  @JoinColumn({ name: 'main_category' })
  category: Category;

  @OneToMany(() => CourseInstallment, installment => installment.course)
  installments: CourseInstallment[];

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
