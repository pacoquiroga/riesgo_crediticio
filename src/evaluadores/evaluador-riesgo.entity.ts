import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../cliente/cliente';
import { ResultadoEvaluacion } from './dto/resultado-evaluacion.dto';

@Entity()
export abstract class EvaluadorRiesgo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('numeric')
  puntajeBase: number;

  abstract aplica(cliente: Cliente): boolean;
  abstract evaluar(cliente: Cliente): ResultadoEvaluacion;

  protected calcularPuntajeFinal(cliente: Cliente): number {
    return cliente.puntajeCrediticio + this.puntajeBase;
  }

  protected determinarNivelRiesgo(puntaje: number): string {
    if (puntaje > 800) return 'BAJO';
    if (puntaje > 600) return 'MEDIO';
    return 'ALTO';
  }
}