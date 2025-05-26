import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonaNatural } from './persona-natural.entity';
import { PersonaJuridica } from './persona-juridica.entity';
import { CrearClienteNaturalDto } from './dto/crear-cliente-natural.dto';
import { CrearClienteJuridicoDto } from './dto/crear-cliente-juridico.dto';
import { ClienteAbs } from './cliente-abs.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(PersonaNatural)
    private readonly personaNaturalRepository: Repository<PersonaNatural>,
    @InjectRepository(PersonaJuridica)
    private readonly personaJuridicaRepository: Repository<PersonaJuridica>
  ) {}

  async existeCliente(nombre: string): Promise<boolean> {
    const clienteNatural = await this.personaNaturalRepository.findOne({
      where: { nombre }
    });

    if (clienteNatural) {
      return true;
    }

    const clienteJuridico = await this.personaJuridicaRepository.findOne({
      where: { nombre }
    });

    return !!clienteJuridico;
  }

  async crearPersonaNatural(dto: CrearClienteNaturalDto): Promise<PersonaNatural> {
    const existe = await this.existeCliente(dto.nombre);
    if (existe) {
      throw new HttpException(
        `Ya existe un cliente con el nombre ${dto.nombre}`,
        HttpStatus.CONFLICT
      );
    }

    const personaNatural = this.personaNaturalRepository.create(dto);
    return this.personaNaturalRepository.save(personaNatural);
  }

  async crearPersonaJuridica(dto: CrearClienteJuridicoDto): Promise<PersonaJuridica> {
    const existe = await this.existeCliente(dto.nombre);
    if (existe) {
      throw new HttpException(
        `Ya existe un cliente con el nombre ${dto.nombre}`,
        HttpStatus.CONFLICT
      );
    }

    const personaJuridica = this.personaJuridicaRepository.create(dto);
    return this.personaJuridicaRepository.save(personaJuridica);
  }

  async obtenerClientePorId(id: number): Promise<ClienteAbs> {
    const personaNatural = await this.personaNaturalRepository.findOne({
      where: { id },
      relations: ['historialesEvaluacion']
    });

    if (personaNatural) {
      return personaNatural;
    }

    const personaJuridica = await this.personaJuridicaRepository.findOne({
      where: { id },
      relations: ['historialesEvaluacion']
    });

    if (personaJuridica) {
      return personaJuridica;
    }

    throw new HttpException(
      `No se encontró ningún cliente con el ID ${id}`,
      HttpStatus.NOT_FOUND
    );
  }

  async obtenerClientePorNombre(nombre: string): Promise<ClienteAbs> {
    const personaNatural = await this.personaNaturalRepository.findOne({
      where: { nombre },
      relations: ['historialesEvaluacion']
    });

    if (personaNatural) {
      return personaNatural;
    }

    const personaJuridica = await this.personaJuridicaRepository.findOne({
      where: { nombre },
      relations: ['historialesEvaluacion']
    });

    if (personaJuridica) {
      return personaJuridica;
    }

    throw new HttpException(
      `No se encontró ningún cliente con el nombre ${nombre}`,
      HttpStatus.NOT_FOUND
    );
  }

  async obtenerTodosLosClientes(): Promise<ClienteAbs[]> {
    const [personasNaturales, personasJuridicas] = await Promise.all([
      this.personaNaturalRepository.find({ relations: ['historialesEvaluacion'] }),
      this.personaJuridicaRepository.find({ relations: ['historialesEvaluacion'] })
    ]);

    return [...personasNaturales, ...personasJuridicas];
  }

  async evaluarSolicitudCredito(id: number): Promise<boolean> {
    const cliente = await this.obtenerClientePorId(id);
    return cliente.esAptoParaCredito();
  }

  async obtenerIngresoReferencial(id: number): Promise<number> {
    const cliente = await this.obtenerClientePorId(id);
    return cliente.getIngresoReferencial();
  }

  async obtenerMontoDeudas(id: number): Promise<number> {
    const cliente = await this.obtenerClientePorId(id);
    return cliente.getMontoDeudas();
  }
}
