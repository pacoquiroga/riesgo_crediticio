import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, Logger } from '@nestjs/common';
import { ResultadoEvaluacion } from './dto/resultado-evaluacion.dto';
import { EvaluarClienteDto, TipoCliente } from './dto/evaluar-cliente.dto';
import { EvaluadorRiesgoService } from './evaluador-riesgo.service';
import { ClienteService } from '../cliente/cliente.service';
import { PersonaNatural } from '../cliente/persona-natural.entity';
import { PersonaJuridica } from '../cliente/persona-juridica.entity';
import { ClienteAbs } from '../cliente/cliente-abs.entity';
import { HistorialEvaluacionService } from '../historial/historial-evaluacion.service';

@Controller('evaluar-riesgo')
export class EvaluadorRiesgoController {
  private readonly logger = new Logger(EvaluadorRiesgoController.name);

  constructor(
    private readonly evaluadorRiesgoService: EvaluadorRiesgoService,
    private readonly clienteService: ClienteService,
    private readonly historialService: HistorialEvaluacionService
  ) {}

  @Post()
  async evaluarRiesgo(@Body() clienteData: EvaluarClienteDto): Promise<ResultadoEvaluacion> {
    this.logger.debug(`Recibiendo solicitud de evaluación para cliente: ${JSON.stringify(clienteData)}`);
    let cliente: ClienteAbs;

    try {
      // Verificar si el cliente ya existe
      try {
        const clienteExistente = await this.clienteService.obtenerClientePorNombre(clienteData.nombre);
        if (clienteExistente) {
          this.logger.debug(`Cliente ${clienteData.nombre} ya existe, evaluando riesgo...`);
          const resultado = await this.evaluadorRiesgoService.evaluarRiesgo(clienteExistente);
          await this.historialService.crearHistorialEvaluacion(clienteExistente, resultado);
          return resultado;
        }
      } catch (error) {
        // Si no encuentra el cliente, continuamos con la creación
        if (error.status !== HttpStatus.NOT_FOUND) {
          throw error;
        }
      }

      // Crear el cliente según su tipo
      if (clienteData.tipoCliente === TipoCliente.NATURAL) {
        this.logger.debug('Procesando cliente natural');
        if (!clienteData.ingresoMensual || !clienteData.edad) {
          throw new HttpException('Datos de persona natural incompletos: se requiere ingresoMensual y edad', HttpStatus.BAD_REQUEST);
        }
        cliente = await this.clienteService.crearPersonaNatural({
          nombre: clienteData.nombre,
          edad: clienteData.edad,
          ingresoMensual: clienteData.ingresoMensual,
          puntajeCrediticio: clienteData.puntajeCrediticio,
          deudasActuales: clienteData.deudasActuales,
          montoSolicitado: clienteData.montoSolicitado,
          plazoEnMeses: clienteData.plazoEnMeses
        });
        this.logger.debug(`Cliente natural creado con ID: ${cliente.id}`);
      } else if (clienteData.tipoCliente === TipoCliente.JURIDICA) {
        this.logger.debug('Procesando cliente jurídico');
        if (!clienteData.ingresoAnual || !clienteData.antiguedadAnios || !clienteData.empleados) {
          throw new HttpException(
            'Datos de persona jurídica incompletos: se requiere ingresoAnual, antiguedadAnios y empleados',
            HttpStatus.BAD_REQUEST
          );
        }
        cliente = await this.clienteService.crearPersonaJuridica({
          nombre: clienteData.nombre,
          antiguedadAnios: clienteData.antiguedadAnios,
          ingresoAnual: clienteData.ingresoAnual,
          empleados: clienteData.empleados,
          puntajeCrediticio: clienteData.puntajeCrediticio,
          deudasActuales: clienteData.deudasActuales,
          montoSolicitado: clienteData.montoSolicitado,
          plazoEnMeses: clienteData.plazoEnMeses
        });
        this.logger.debug(`Cliente jurídico creado con ID: ${cliente.id}`);
      } else {
        throw new HttpException('Tipo de cliente no válido', HttpStatus.BAD_REQUEST);
      }

      // Evaluar riesgo
      this.logger.debug('Evaluando riesgo del cliente');
      const resultado = await this.evaluadorRiesgoService.evaluarRiesgo(cliente);

      // Crear registro histórico
      this.logger.debug('Creando registro histórico');
      await this.historialService.crearHistorialEvaluacion(cliente, resultado);

      return resultado;

    } catch (error) {
      this.logger.error('Error en evaluarRiesgo:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al procesar la solicitud: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async obtenerEvaluacion(@Param('id') id: number): Promise<ResultadoEvaluacion> {
    const cliente = await this.clienteService.obtenerClientePorId(id);
    return this.evaluadorRiesgoService.evaluarRiesgo(cliente);
  }

  @Get(':id/historial')
  async obtenerHistorialEvaluaciones(@Param('id') id: number) {
    return this.historialService.obtenerHistorialPorCliente(id);
  }
}