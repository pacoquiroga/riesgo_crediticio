import { IsString, IsNumber, IsArray, Min, IsPositive } from 'class-validator';
import { Deuda } from '../dto/deuda.entity';

export class CrearClienteNaturalDto {
  @IsString()
  nombre: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  edad: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  ingresoMensual: number;

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
