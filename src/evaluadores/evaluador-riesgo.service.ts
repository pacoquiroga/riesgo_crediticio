import { Injectable } from '@nestjs/common';
import { ResultadoEvaluacion } from './dto/resultado-evaluacion.dto';
import { ClienteAbs } from '../cliente/cliente-abs.entity';
import { PersonaNatural } from '../cliente/persona-natural.entity';
import { PersonaJuridica } from '../cliente/persona-juridica.entity';

@Injectable()
export class EvaluadorRiesgoService {
  async evaluarRiesgo(cliente: ClienteAbs): Promise<ResultadoEvaluacion> {
    let puntaje = 100;

    // Penalización por Puntaje Crediticio
    if (cliente.puntajeCrediticio < 650) {
      puntaje -= 30;
    }

    const montoSolicitado = cliente.montoSolicitado;
    const plazo = cliente.plazoEnMeses;

    if (cliente instanceof PersonaNatural) {
      const ingresoMensual = cliente.getIngresoReferencial();
      const deudasTotales = cliente.getMontoDeudas();
      const ratioDeuda = deudasTotales / ingresoMensual;

      // Deuda > 40% del ingreso mensual
      if (ratioDeuda > 0.4) {
        puntaje -= 15;
      }

      // Monto solicitado > 50% del ingreso mensual
      const ratioMontoSolicitado = montoSolicitado / ingresoMensual;
      if (ratioMontoSolicitado > 0.5) {
        puntaje -= 10;
      }

    } else if (cliente instanceof PersonaJuridica) {
      const ingresoAnual = cliente.getIngresoReferencial();
      const deudasTotales = cliente.getMontoDeudas();
      const ratioDeuda = deudasTotales / ingresoAnual;

      // Deuda > 35% del ingreso anual
      if (ratioDeuda > 0.35) {
        puntaje -= 20;
      }

      // Monto solicitado > 30% del ingreso anual
      const ratioMontoSolicitado = montoSolicitado / ingresoAnual;
      if (ratioMontoSolicitado > 0.3) {
        puntaje -= 15;
      }
    }

    // Determinar Nivel de Riesgo y Condiciones
    let nivelRiesgo = '';
    let tasaInteres = 0;
    let aprobado = false;

    if (puntaje >= 80) {
      nivelRiesgo = 'BAJO';
      tasaInteres = 6.5;
      aprobado = true;
    } else if (puntaje >= 60) {
      nivelRiesgo = 'MEDIO';
      tasaInteres = 8.0;
      aprobado = true;
    } else {
      nivelRiesgo = 'ALTO';
      tasaInteres = 0;
      aprobado = false;
    }

    return {
      nivelRiesgo,
      aprobado,
      puntajeFinal: puntaje,
      mensaje: this.generarMensaje(puntaje, cliente),
      tasaInteres,
      plazoAprobado: aprobado ? plazo : 0,
    };
  }

  private generarMensaje(puntaje: number, cliente: ClienteAbs): string {
    if (puntaje >= 80) {
      return 'Cliente apto para préstamo con condiciones preferenciales';
    } else if (puntaje >= 60) {
      return 'Cliente apto para préstamo con condiciones ajustadas';
    } else {
      return 'Cliente no apto para préstamo';
    }
  }
}
