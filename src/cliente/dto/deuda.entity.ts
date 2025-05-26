import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Deuda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column()
  plazoMeses: number;
} 