import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './course.entity';

@Entity('course_installments')
export class CourseInstallment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  course_id: number;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date', nullable: true })
  installment_date: Date;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @ManyToOne(() => Course, course => course.installments)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
