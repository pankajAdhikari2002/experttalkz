import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Course } from './course.entity';

@Entity('installment_plans')
export class InstallmentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  course_id: string;

  @Column('int')
  total_installments: number;

  @Column('decimal', { precision: 10, scale: 2 })
  installment_amount: number;

  @OneToOne(() => Course, course => course.installments)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
