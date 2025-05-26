import { Entity, Column, PrimaryGeneratedColumn, OneToMany, TableInheritance } from 'typeorm';
import { Deuda } from './dto/deuda.entity';
import { HistorialEvaluacion } from '../historial/historial-evaluacion.entity';

@Entity('cliente_abs')
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class ClienteAbs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  puntajeCrediticio: number;

  @Column('json')
  deudasActuales: Deuda[]; 

  @Column('decimal', { precision: 10, scale: 2 })
  montoSolicitado: number;

  @Column()
  plazoEnMeses: number;

  @OneToMany(() => HistorialEvaluacion, historial => historial.cliente, {
    cascade: true
  })
  historialesEvaluacion: HistorialEvaluacion[];

  abstract getIngresoReferencial(): number;
  abstract esAptoParaCredito(): boolean;
  abstract getMontoDeudas(): number;
} 