import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } })
export abstract class EvaluadorRiesgo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  puntajeBase: number;

  @Column()
  tipo: string;

  abstract aplica(cliente: Cliente): boolean;
  abstract evaluar(cliente: Cliente): ResultadoEvaluacion;
}
