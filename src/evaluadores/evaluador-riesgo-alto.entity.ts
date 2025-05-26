import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EvaluadorRiesgo } from './evaluador-riesgo.entity';
import { Cliente } from '../cliente/cliente';
import { ResultadoEvaluacion } from './dto/resultado-evaluacion.dto';

@Entity()
export class EvaluadorRiesgoAlto extends EvaluadorRiesgo {

  @Column({ default: 'ALTO' })
  nivelRiesgo: string= 'ALTO';

  aplica(cliente: Cliente): boolean {
    return cliente.puntajeCrediticio < 600;
  }

  evaluar(cliente: Cliente): ResultadoEvaluacion {
    const puntajeFinal = this.calcularPuntajeFinal(cliente);
    return {
      nivelRiesgo: 'ALTO',
      aprobado: false,
      puntajeFinal,
      mensaje: 'Cliente no apto para préstamo',
      tasaInteres: 0,
      plazoAprobado: 0,
    };
  }

  private calcularPuntaje(cliente: Cliente): number {
    let puntaje = 100;
    if (cliente.puntajeCrediticio < 650) puntaje -= 30;
    return puntaje;
  }
}