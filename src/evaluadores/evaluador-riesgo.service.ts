import { Injectable } from '@nestjs/common';
import { ResultadoEvaluacion } from './dto/resultado-evaluacion.dto';

@Injectable()
export class EvaluadorRiesgoService {
  evaluarRiesgo(clienteData: any): ResultadoEvaluacion {
    let puntaje = 100;

    // Penalización por Puntaje Crediticio
    if (clienteData.puntajeCrediticio < 650) {
      puntaje -= 30;
    }

    // Penalización por Deudas
    const deudasTotales = clienteData.deudasActuales.reduce((sum, deuda) => sum + deuda.monto, 0);
    const ratioDeuda = deudasTotales / clienteData.ingresoMensual;
    if (ratioDeuda > 0.4) {
      puntaje -= 15;
    }

    // Penalización por Monto Solicitado
    const ratioMontoSolicitado = clienteData.montoSolicitado / clienteData.ingresoMensual;
    if (ratioMontoSolicitado > 0.5) {
      puntaje -= 10;
    }

    // Determinar Nivel de Riesgo
    let nivelRiesgo = 'BAJO';
    let tasaInteres = 5.0;
    if (puntaje < 80) {
      nivelRiesgo = 'MEDIO';
      tasaInteres = 8.0;
    }
    if (puntaje < 50) {
      nivelRiesgo = 'ALTO';
      tasaInteres = 12.0;
    }

    return {
      nivelRiesgo,
      aprobado: puntaje >= 50,
      puntajeFinal: puntaje,
      mensaje: puntaje >= 50 ? 'Cliente apto para préstamo con condiciones ajustadas' : 'Cliente no apto para préstamo',
      tasaInteres,
      plazoAprobado: clienteData.plazoEnMeses,
    };
  }
}