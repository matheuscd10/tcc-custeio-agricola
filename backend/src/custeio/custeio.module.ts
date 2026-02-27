import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CusteioService } from './custeio.service.js';
import { CusteioController } from './custeio.controller.js';
import { TituloPagar } from './entities/titulo-pagar.entity.js';
import { ValorTituloPagar } from './entities/valor-titulo-pagar.entity.js';
import { BaixaTituloPagar } from './entities/baixa-titulo-pagar.entity.js';
import { TituloReceber } from './entities/titulo-receber.entity.js';
import { ValorTituloReceber } from './entities/valor-titulo-receber.entity.js';
import { BaixaTituloReceber } from './entities/baixa-titulo-receber.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TituloPagar,
            ValorTituloPagar,
            BaixaTituloPagar,
            TituloReceber,
            ValorTituloReceber,
            BaixaTituloReceber,
        ]),
    ],
    controllers: [CusteioController],
    providers: [CusteioService],
    exports: [CusteioService],
})
export class CusteioModule { }
