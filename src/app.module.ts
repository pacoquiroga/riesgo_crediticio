import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaluadorRiesgoResolver } from './evaluador_riesgo/evaluador_riesgo.resolver';
import { EvaluadorRiesgoModule } from './evaluador-riesgo/evaluador-riesgo.module';

@Module({
  imports: [EvaluadorRiesgoModule],
  controllers: [AppController],
  providers: [AppService, EvaluadorRiesgoResolver],
})
export class AppModule {}
