import { IsString, IsNumber, IsArray, IsEnum, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Deuda } from '../../cliente/dto/deuda.entity';

export enum TipoCliente {
  NATURAL = 'NATURAL',
  JURIDICA = 'JURIDICA'
}

export class EvaluarClienteDto {
  @IsString()
  nombre: string;

  @IsEnum(TipoCliente)
  tipoCliente: TipoCliente;

  @IsNumber()
  @Min(0)
  puntajeCrediticio: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Deuda)
  deudasActuales: Deuda[];

  @IsNumber()
  @Min(0)
  montoSolicitado: number;

  @IsNumber()
  @Min(1)
  plazoEnMeses: number;

  @IsNumber()
  @Min(0)
  ingresoMensual?: number;

  @IsNumber()
  @Min(0)
  ingresoAnual?: number;

  @IsNumber()
  @Min(0)
  edad?: number;

  @IsNumber()
  @Min(0)
  antiguedadAnios?: number;

  @IsNumber()
  @Min(0)
  empleados?: number;
} 