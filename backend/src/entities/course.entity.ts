import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Category } from './category.entity';
import { InstallmentPlan } from './installment-plan.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  course_name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount_price: number;

  @Column()
  course_duration: string;

  @Column({ type: 'enum', enum: ['Online', 'Offline'], default: 'Online' })
  course_mode: string;

  @Column({ type: 'enum', enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' })
  level: string;

  @Column('text')
  thumbnail: string;

  @ManyToOne(() => Category, category => category.courses, { nullable: true, eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('decimal', { precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column({ default: false })
  is_featured: boolean;

  @OneToOne(() => InstallmentPlan, installmentPlan => installmentPlan.course, { cascade: true, eager: true, nullable: true })
  installments: InstallmentPlan;
}
