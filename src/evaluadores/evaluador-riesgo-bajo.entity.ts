import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EvaluadorRiesgo } from './evaluador-riesgo.entity';
import { Cliente } from '../cliente/cliente';
import { ResultadoEvaluacion } from './dto/resultado-evaluacion.dto';

@Entity()
export class EvaluadorRiesgoBajo extends EvaluadorRiesgo {

  @Column({ default: 'BAJO' })
  nivelRiesgo: string = 'BAJO';

  aplica(cliente: Cliente): boolean {
    return cliente.puntajeCrediticio > 800;
  }

  evaluar(cliente: Cliente): ResultadoEvaluacion {
    const puntajeFinal = this.calcularPuntajeFinal(cliente);
    return {
      nivelRiesgo: 'BAJO',
      aprobado: true,
      puntajeFinal,
      mensaje: 'Cliente apto para préstamo con bajo riesgo',
      tasaInteres: 5,
      plazoAprobado: 60,
    };
  }

  private calcularPuntaje(cliente: Cliente): number {
    let puntaje = 100;
    if (cliente.puntajeCrediticio < 650) puntaje -= 30;
    return puntaje;
  }
}