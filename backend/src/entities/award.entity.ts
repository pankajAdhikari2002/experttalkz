import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('awards')
export class Award {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  award_title: string;

  @Column()
  award_image: string;
}
