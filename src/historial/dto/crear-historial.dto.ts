import { IsString, IsNumber, IsBoolean, IsDate, IsNotEmpty, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoCliente {
  NATURAL = 'NATURAL',
  JURIDICA = 'JURIDICA'
}

export class CrearHistorialDto {
  @IsString()
  @IsNotEmpty()
  clienteNombre: string;

  @IsEnum(TipoCliente)
  tipoCliente: TipoCliente;

  @IsNumber()
  @Min(0)
  montoSolicitado: number;

  @IsNumber()
  @Min(1)
  plazoEnMeses: number;

  @IsString()
  @IsNotEmpty()
  nivelRiesgo: string;

  @IsBoolean()
  aprobado: boolean;

  @IsDate()
  @Type(() => Date)
  fechaConsulta: Date;
} 