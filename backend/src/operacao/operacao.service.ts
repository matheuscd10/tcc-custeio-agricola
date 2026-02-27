import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoValorFinanceiro } from './entities/tipo-valor-financeiro.entity.js';
import { OperacaoFinanceira } from './entities/operacao-financeira.entity.js';
import {
    CreateTipoValorFinanceiroDto,
    CreateOperacaoFinanceiraDto,
} from './dto/create-operacao.dto.js';
import {
    UpdateTipoValorFinanceiroDto,
    UpdateOperacaoFinanceiraDto,
} from './dto/update-operacao.dto.js';

@Injectable()
export class OperacaoService {
    constructor(
        @InjectRepository(TipoValorFinanceiro)
        private readonly tipoValorRepository: Repository<TipoValorFinanceiro>,
        @InjectRepository(OperacaoFinanceira)
        private readonly operacaoRepository: Repository<OperacaoFinanceira>,
    ) { }

    // ========== TIPO VALOR FINANCEIRO ==========

    async createTipoValor(dto: CreateTipoValorFinanceiroDto): Promise<TipoValorFinanceiro> {
        const tipo = this.tipoValorRepository.create(dto);
        return this.tipoValorRepository.save(tipo);
    }

    async findAllTipoValor(): Promise<TipoValorFinanceiro[]> {
        return this.tipoValorRepository.find({ order: { descricao: 'ASC' } });
    }

    async findOneTipoValor(id: number): Promise<TipoValorFinanceiro> {
        const tipo = await this.tipoValorRepository.findOne({ where: { id } });
        if (!tipo) {
            throw new NotFoundException(`Tipo de valor financeiro com ID ${id} não encontrado`);
        }
        return tipo;
    }

    async updateTipoValor(id: number, dto: UpdateTipoValorFinanceiroDto): Promise<TipoValorFinanceiro> {
        const tipo = await this.findOneTipoValor(id);
        Object.assign(tipo, dto);
        return this.tipoValorRepository.save(tipo);
    }

    async removeTipoValor(id: number): Promise<void> {
        const tipo = await this.findOneTipoValor(id);
        await this.tipoValorRepository.remove(tipo);
    }

    // ========== OPERAÇÃO FINANCEIRA ==========

    async createOperacao(dto: CreateOperacaoFinanceiraDto): Promise<OperacaoFinanceira> {
        const operacao = this.operacaoRepository.create(dto);
        return this.operacaoRepository.save(operacao);
    }

    async findAllOperacoes(): Promise<OperacaoFinanceira[]> {
        return this.operacaoRepository.find({ order: { descricao: 'ASC' } });
    }

    async findOneOperacao(id: number): Promise<OperacaoFinanceira> {
        const operacao = await this.operacaoRepository.findOne({ where: { id } });
        if (!operacao) {
            throw new NotFoundException(`Operação financeira com ID ${id} não encontrada`);
        }
        return operacao;
    }

    async updateOperacao(id: number, dto: UpdateOperacaoFinanceiraDto): Promise<OperacaoFinanceira> {
        const operacao = await this.findOneOperacao(id);
        Object.assign(operacao, dto);
        return this.operacaoRepository.save(operacao);
    }

    async removeOperacao(id: number): Promise<void> {
        const operacao = await this.findOneOperacao(id);
        await this.operacaoRepository.remove(operacao);
    }
}
