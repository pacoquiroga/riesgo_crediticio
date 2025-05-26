import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialEvaluacion } from './historial-evaluacion.entity';
import { ClienteAbs } from '../cliente/cliente-abs.entity';
import { ResultadoEvaluacion } from '../evaluadores/dto/resultado-evaluacion.dto';
import { PersonaNatural } from 'src/cliente/persona-natural.entity';
import { CrearHistorialDto, TipoCliente } from './dto/crear-historial.dto';
import { HistorialEvaluacionDto } from './dto/historial-evaluacion.dto';

@Injectable()
export class HistorialEvaluacionService {
  constructor(
    @InjectRepository(HistorialEvaluacion)
    private readonly historialRepository: Repository<HistorialEvaluacion>
  ) {}

  async crearHistorialEvaluacion(
    cliente: ClienteAbs,
    resultado: ResultadoEvaluacion
  ): Promise<HistorialEvaluacionDto> {
    const historialDto = new CrearHistorialDto();
    historialDto.clienteNombre = cliente.nombre;
    historialDto.tipoCliente = cliente instanceof PersonaNatural ? TipoCliente.NATURAL : TipoCliente.JURIDICA;
    historialDto.montoSolicitado = cliente.montoSolicitado;
    historialDto.plazoEnMeses = cliente.plazoEnMeses;
    historialDto.nivelRiesgo = resultado.nivelRiesgo;
    historialDto.aprobado = resultado.aprobado;
    historialDto.fechaConsulta = new Date();

    const historial = this.historialRepository.create({
      ...historialDto,
      cliente: cliente
    });

    const savedHistorial = await this.historialRepository.save(historial);
    return this.mapToDto(savedHistorial);
  }

  async obtenerHistorialPorCliente(clienteId: number): Promise<HistorialEvaluacionDto[]> {
    const historiales = await this.historialRepository.find({
      where: { cliente: { id: clienteId } },
      order: { fechaConsulta: 'DESC' },
      relations: ['cliente']
    });

    return historiales.map(historial => this.mapToDto(historial));
  }

  private mapToDto(historial: HistorialEvaluacion): HistorialEvaluacionDto {
    const dto = new HistorialEvaluacionDto();
    dto.id = historial.id;
    dto.clienteNombre = historial.clienteNombre;
    dto.tipoCliente = historial.tipoCliente as TipoCliente;
    dto.montoSolicitado = historial.montoSolicitado;
    dto.plazoEnMeses = historial.plazoEnMeses;
    dto.nivelRiesgo = historial.nivelRiesgo;
    dto.aprobado = historial.aprobado;
    dto.fechaConsulta = historial.fechaConsulta;
    dto.clienteId = historial.cliente.id;
    return dto;
  }
} 