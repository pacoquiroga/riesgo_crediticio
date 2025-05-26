import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EvaluadorRiesgo } from './evaluador-riesgo.entity';
import { Cliente } from '../cliente/cliente';
import { ResultadoEvaluacion } from './dto/resultado-evaluacion.dto';

@Entity()
export class EvaluadorRiesgoMedio extends EvaluadorRiesgo {

  @Column({ default: 'MEDIO' })
  nivelRiesgo: string = 'MEDIO';

  aplica(cliente: Cliente): boolean {
    return cliente.puntajeCrediticio >= 600 && cliente.puntajeCrediticio <= 800;
  }

  evaluar(cliente: Cliente): ResultadoEvaluacion {
    const puntajeFinal = this.calcularPuntajeFinal(cliente);
    return {
      nivelRiesgo: 'MEDIO',
      aprobado: true,
      puntajeFinal,
      mensaje: 'Cliente apto para préstamo con riesgo moderado',
      tasaInteres: 10,
      plazoAprobado: 48,
    };
  }

  private calcularPuntaje(cliente: Cliente): number {
    let puntaje = 100;
    if (cliente.puntajeCrediticio < 650) puntaje -= 30;
    return puntaje;
  }
}