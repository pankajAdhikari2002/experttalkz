import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('awards')
export class Award {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  award_title: string;

  @Column({ nullable: true })
  award_image: string;

  @Column({ nullable: true })
  alt_tag: string;

  @Column({ default: 0 })
  order: number;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;
}
