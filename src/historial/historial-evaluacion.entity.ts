import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { ClienteAbs } from '../cliente/cliente-abs.entity';

@Entity()
export class HistorialEvaluacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clienteNombre: string;

    @Column()
    tipoCliente: string;

    @Column('decimal', { precision: 10, scale: 2 })
    montoSolicitado: number;

    @Column()
    plazoEnMeses: number;

    @Column()
    nivelRiesgo: string;

    @Column()
    aprobado: boolean;

    @CreateDateColumn()
    fechaConsulta: Date;

    @ManyToOne(() => ClienteAbs, cliente => cliente.historialesEvaluacion, {
        eager: false,
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'clienteId' })
    cliente: ClienteAbs;
} 