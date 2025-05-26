import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluadorRiesgoController } from './evaluadores/evaluador-riesgo.controller';
import { EvaluadorRiesgoService } from './evaluadores/evaluador-riesgo.service';
import { ClienteService } from './cliente/cliente.service';
import { PersonaNatural } from './cliente/persona-natural.entity';
import { PersonaJuridica } from './cliente/persona-juridica.entity';
import { ClienteAbs } from './cliente/cliente-abs.entity';
import { Deuda } from './cliente/dto/deuda.entity';
import { HistorialEvaluacion } from './historial/historial-evaluacion.entity';
import { HistorialEvaluacionService } from './historial/historial-evaluacion.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'bancodb',
      entities: [PersonaNatural, PersonaJuridica, Deuda, HistorialEvaluacion, ClienteAbs],
      synchronize: true,
      logging: true,
      logger: 'advanced-console'
    }),
    TypeOrmModule.forFeature([
      PersonaNatural,
      PersonaJuridica,
      Deuda,
      HistorialEvaluacion,
    ]),
  ],
  controllers: [AppController, EvaluadorRiesgoController],
  providers: [
    AppService,
    EvaluadorRiesgoService,
    ClienteService,
    HistorialEvaluacionService,
  ],
})
export class AppModule {}
