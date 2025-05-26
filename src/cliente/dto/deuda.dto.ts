import { IsNumber, IsPositive, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeudaDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto debe ser un número con máximo 2 decimales' })
  @IsPositive({ message: 'El monto debe ser mayor a 0' })
  @Max(1000000, { message: 'El monto no puede ser mayor a 1,000,000' })
  @Type(() => Number)
  monto: number;

  @IsInt({ message: 'El plazo debe ser un número entero' })
  @Min(1, { message: 'El plazo mínimo es 1 mes' })
  @Max(360, { message: 'El plazo máximo es 360 meses (30 años)' })
  @Type(() => Number)
  plazoMeses: number;
} 