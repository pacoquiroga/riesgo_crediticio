import { Entity, Column, ChildEntity } from 'typeorm';
import { ClienteAbs } from './cliente-abs.entity';

@ChildEntity('NATURAL')
export class PersonaNatural extends ClienteAbs {
  @Column()
  edad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  ingresoMensual: number;

  getIngresoReferencial(): number {
    return this.ingresoMensual;
  }

  esAptoParaCredito(): boolean {
    return this.puntajeCrediticio > 700 && this.ingresoMensual > this.getMontoDeudas();
  }

  getMontoDeudas(): number {
    return this.deudasActuales.reduce((total, deuda) => total + deuda.monto, 0);
  }
} 