import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EventCategory } from './event-category.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  slug: string | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  category_id: number | null;

  @Column({ length: 255 })
  date_text: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 500, nullable: true })
  image: string | null;

  @Column({ length: 50, default: 'NEW' })
  badge: string;

  @Column({ length: 50, default: 'blue' })
  color: string;

  @Column({ length: 500, nullable: true })
  link_url: string | null;

  @Column({ length: 100, default: 'Learn More' })
  link_text: string;

  @Column({ type: 'tinyint', default: 0 })
  is_featured: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => EventCategory, (category) => category.events, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: EventCategory;
}
