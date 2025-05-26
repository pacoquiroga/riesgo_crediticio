export class PersonaNaturalDto {
  tipoCliente: string;
  nombre: string;
  puntajeCrediticio: number;
  deudasActuales: Deuda[];
  montoSolicitado: number;
  plazoEnMeses: number;
  edad: number;
  ingresoMensual: number;
}

export class Deuda {
  monto: number;
  plazoMeses: number;
}
