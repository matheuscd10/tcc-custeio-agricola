import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperacaoService } from './operacao.service.js';
import { OperacaoController } from './operacao.controller.js';
import { TipoValorFinanceiro } from './entities/tipo-valor-financeiro.entity.js';
import { OperacaoFinanceira } from './entities/operacao-financeira.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([TipoValorFinanceiro, OperacaoFinanceira])],
    controllers: [OperacaoController],
    providers: [OperacaoService],
    exports: [OperacaoService],
})
export class OperacaoModule { }
