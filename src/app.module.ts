import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './cliente/cliente';
import { PersonaNatural } from './cliente/cliente';
import { PersonaJuridica } from './cliente/cliente';
import { EvaluadorRiesgo } from './evaluadores/evaluador-riesgo.entity';
import { EvaluadorRiesgoBajo } from './evaluadores/evaluador-riesgo-bajo.entity';
import { EvaluadorRiesgoMedio } from './evaluadores/evaluador-riesgo-medio.entity';
import { EvaluadorRiesgoAlto } from './evaluadores/evaluador-riesgo-alto.entity';
import { EvaluadorRiesgoController } from './evaluadores/evaluador-riesgo.controller';
import { EvaluadorRiesgoService } from './evaluadores/evaluador-riesgo.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'bancodb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Cliente,
      PersonaNatural,
      PersonaJuridica,
      EvaluadorRiesgo,
      EvaluadorRiesgoBajo,
      EvaluadorRiesgoMedio,
      EvaluadorRiesgoAlto,
    ]),
  ],
  controllers: [AppController, EvaluadorRiesgoController],
  providers: [
    AppService,
    {
      provide: 'EVALUADORES_RIESGO',
      useFactory: () => [
        new EvaluadorRiesgoBajo(),
        new EvaluadorRiesgoMedio(),
        new EvaluadorRiesgoAlto(),
      ],
    },
    EvaluadorRiesgoService,
  ],
})
export class AppModule {}
