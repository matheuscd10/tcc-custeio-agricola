import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatorioService } from './relatorio.service.js';
import { RelatorioController } from './relatorio.controller.js';
import { TituloPagar } from '../custeio/entities/titulo-pagar.entity.js';
import { TituloReceber } from '../custeio/entities/titulo-receber.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([TituloPagar, TituloReceber])],
    controllers: [RelatorioController],
    providers: [RelatorioService],
})
export class RelatorioModule { }
