import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Deuda } from './dto/persona-natural.dto';

@Entity()
export abstract class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  puntajeCrediticio: number;

  @Column('json')
  deudasActuales: Deuda[]; 

  @Column('numeric')
  montoSolicitado: number;

  @Column()
  plazoEnMeses: number;

  abstract getIngresoReferencial(): number;
  abstract esAptoParaCredito(): boolean;
  abstract getMontoDeudas(): number;
}

@Entity()
export class PersonaNatural extends Cliente {
  @Column()
  edad: number;

  @Column('numeric')
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

@Entity()
export class PersonaJuridica extends Cliente {
  @Column()
  antiguedadAnios: number;

  @Column('numeric')
  ingresoAnual: number;

  @Column()
  empleados: number;

  getIngresoReferencial(): number {
    return this.ingresoAnual / 12; 
  }

  esAptoParaCredito(): boolean {
    return this.puntajeCrediticio > 800 && this.ingresoAnual > this.getMontoDeudas();
  }

  getMontoDeudas(): number {
    return this.deudasActuales.reduce((total, deuda) => total + deuda.monto, 0);
  }
}