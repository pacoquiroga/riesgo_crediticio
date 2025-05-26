import { TipoCliente } from './crear-historial.dto';

export class HistorialEvaluacionDto {
  id: number;
  clienteNombre: string;
  tipoCliente: TipoCliente;
  montoSolicitado: number;
  plazoEnMeses: number;
  nivelRiesgo: string;
  aprobado: boolean;
  fechaConsulta: Date;
  clienteId: number;
} 