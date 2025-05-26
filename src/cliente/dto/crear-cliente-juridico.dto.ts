import { IsString, IsNumber, IsArray, Min, IsPositive } from 'class-validator';
import { Deuda } from '../dto/deuda.entity';

export class CrearClienteJuridicoDto {
  @IsString()
  nombre: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  antiguedadAnios: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  ingresoAnual: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  empleados: number;

  @IsNumber()
  @Min(0)
  puntajeCrediticio: number;

  @IsArray()
  deudasActuales: Deuda[];

  @IsNumber()
  @IsPositive()
  @Min(0)
  montoSolicitado: number;

  @IsNumber()
  @Min(1)
  plazoEnMeses: number;
}
