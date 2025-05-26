import { Controller, Post, Body, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../cliente/cliente';
import { PersonaNatural } from '../cliente/cliente';
import { PersonaJuridica } from '../cliente/cliente';
import { EvaluadorRiesgoBajo } from './evaluador-riesgo-bajo.entity';
import { EvaluadorRiesgoMedio } from './evaluador-riesgo-medio.entity';
import { EvaluadorRiesgoAlto } from './evaluador-riesgo-alto.entity';
import { ResultadoEvaluacion } from './dto/resultado-evaluacion.dto';
import { EvaluadorRiesgoService } from './evaluador-riesgo.service';

@Controller('evaluar-riesgo')
export class EvaluadorRiesgoController {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @Inject('EVALUADORES_RIESGO')
    private readonly evaluadores: (EvaluadorRiesgoBajo | EvaluadorRiesgoMedio | EvaluadorRiesgoAlto)[],
    private readonly evaluadorRiesgoService: EvaluadorRiesgoService
  ) {}

  @Post()
  async evaluarRiesgo(@Body() clienteData: any): Promise<ResultadoEvaluacion> {
    const existingCliente = await this.clienteRepository.findOne({ where: { nombre: clienteData.nombre } });
    if (existingCliente) {
      throw new HttpException('Cliente con el mismo nombre ya existe', HttpStatus.BAD_REQUEST);
    }

    let cliente: Cliente;
    if (clienteData.tipoCliente === 'NATURAL') {
      cliente = this.clienteRepository.create({
        ...clienteData,
        deudasActuales: clienteData.deudasActuales.map((deuda: any) => ({ monto: deuda.monto, plazoMeses: deuda.plazoMeses }))
      } as PersonaNatural);
    } else if (clienteData.tipoCliente === 'JURIDICA') {
      cliente = this.clienteRepository.create({
        ...clienteData,
        deudasActuales: clienteData.deudasActuales.map((deuda: any) => ({ monto: deuda.monto, plazoMeses: deuda.plazoMeses }))
      } as PersonaJuridica);
    } else {
      throw new HttpException('Tipo de cliente no válido', HttpStatus.BAD_REQUEST);
    }

    if (cliente instanceof PersonaNatural) {
      await this.clienteRepository.save(cliente as PersonaNatural);
    } else if (cliente instanceof PersonaJuridica) {
      await this.clienteRepository.save(cliente as PersonaJuridica);
    }

    console.log('Cliente guardado:', cliente);

    // Evaluate risk using the service
    return this.evaluadorRiesgoService.evaluarRiesgo(clienteData);
  }
}