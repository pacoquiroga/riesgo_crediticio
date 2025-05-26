import { Entity, Column, ChildEntity } from 'typeorm';
import { ClienteAbs } from './cliente-abs.entity';

@ChildEntity('JURIDICA')
export class PersonaJuridica extends ClienteAbs {
  @Column()
  antiguedadAnios: number;

  @Column('decimal', { precision: 10, scale: 2 })
  ingresoAnual: number;

  @Column()
  empleados: number;

  getIngresoReferencial(): number {
    return this.ingresoAnual;
  }

  esAptoParaCredito(): boolean {
    return this.puntajeCrediticio > 800 && this.ingresoAnual > this.getMontoDeudas();
  }

  getMontoDeudas(): number {
    return this.deudasActuales.reduce((total, deuda) => total + deuda.monto, 0);
  }
} 