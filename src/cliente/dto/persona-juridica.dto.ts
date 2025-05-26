export class PersonaJuridicaDto {
  tipoCliente: string;
  nombre: string;
  puntajeCrediticio: number;
  deudasActuales: Deuda[];
  montoSolicitado: number;
  plazoEnMeses: number;
  antiguedadAnios: number;
  ingresoAnual: number;
  empleados: number;
}

export class Deuda {
  monto: number;
  plazoMeses: number;
}
