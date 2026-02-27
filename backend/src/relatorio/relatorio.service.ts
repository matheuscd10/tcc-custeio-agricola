import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TituloPagar } from '../custeio/entities/titulo-pagar.entity.js';
import { TituloReceber } from '../custeio/entities/titulo-receber.entity.js';
import { FiltroRelatorioDto, TipoFluxo } from './dto/filtro-relatorio.dto.js';

export interface ResumoDashboard {
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
    percentualOrcamentoUtilizado: number;
    totalTitulosPagar: number;
    totalTitulosReceber: number;
    titulosPagarAbertos: number;
    titulosReceberAbertos: number;
}

export interface ItemFluxoCaixa {
    id: number;
    tipo: 'RECEITA' | 'DESPESA';
    descricao: string;
    pessoaNome: string;
    valorTotal: number;
    dataEmissao: Date;
    dataVencimento: Date;
    status: string;
    operacaoDescricao: string | null;
}

export interface RelatorioDetalhado {
    dados: ItemFluxoCaixa[];
    paginacao: {
        pagina: number;
        itensPorPagina: number;
        totalItens: number;
        totalPaginas: number;
    };
    totais: {
        receitas: number;
        despesas: number;
        saldo: number;
    };
}

@Injectable()
export class RelatorioService {
    constructor(
        @InjectRepository(TituloPagar)
        private readonly tituloPagarRepo: Repository<TituloPagar>,
        @InjectRepository(TituloReceber)
        private readonly tituloReceberRepo: Repository<TituloReceber>,
    ) { }

    // ========== TAREFA 5.1: DASHBOARD ==========

    async getResumoDashboard(): Promise<ResumoDashboard> {
        // Total de receitas (títulos a receber)
        const resultReceitas = await this.tituloReceberRepo
            .createQueryBuilder('tr')
            .select('COALESCE(SUM(tr.valor_total), 0)', 'total')
            .getRawOne();

        // Total de despesas (títulos a pagar)
        const resultDespesas = await this.tituloPagarRepo
            .createQueryBuilder('tp')
            .select('COALESCE(SUM(tp.valor_total), 0)', 'total')
            .getRawOne();

        const totalReceitas = Number(resultReceitas.total);
        const totalDespesas = Number(resultDespesas.total);
        const saldo = totalReceitas - totalDespesas;

        // Percentual de orçamento utilizado (despesas / receitas)
        const percentualOrcamentoUtilizado =
            totalReceitas > 0
                ? Number(((totalDespesas / totalReceitas) * 100).toFixed(2))
                : 0;

        // Contagens
        const totalTitulosPagar = await this.tituloPagarRepo.count();
        const totalTitulosReceber = await this.tituloReceberRepo.count();

        const titulosPagarAbertos = await this.tituloPagarRepo.count({
            where: [{ status: 'ABERTO' as any }, { status: 'PARCIAL' as any }],
        });

        const titulosReceberAbertos = await this.tituloReceberRepo.count({
            where: [{ status: 'ABERTO' as any }, { status: 'PARCIAL' as any }],
        });

        return {
            totalReceitas,
            totalDespesas,
            saldo,
            percentualOrcamentoUtilizado,
            totalTitulosPagar,
            totalTitulosReceber,
            titulosPagarAbertos,
            titulosReceberAbertos,
        };
    }

    // ========== TAREFA 5.2: RELATÓRIO DETALHADO ==========

    async getRelatorioDetalhado(
        filtros: FiltroRelatorioDto,
    ): Promise<RelatorioDetalhado> {
        const pagina = filtros.pagina || 1;
        const itensPorPagina = filtros.itensPorPagina || 20;

        // Montar query para despesas
        const queryDespesas = this.tituloPagarRepo
            .createQueryBuilder('tp')
            .leftJoinAndSelect('tp.pessoa', 'pessoa')
            .leftJoinAndSelect('tp.operacao', 'operacao');

        // Montar query para receitas
        const queryReceitas = this.tituloReceberRepo
            .createQueryBuilder('tr')
            .leftJoinAndSelect('tr.pessoa', 'pessoa')
            .leftJoinAndSelect('tr.operacao', 'operacao');

        // Aplicar filtros de data
        if (filtros.dataInicio) {
            queryDespesas.andWhere('tp.data_emissao >= :dataInicio', {
                dataInicio: filtros.dataInicio,
            });
            queryReceitas.andWhere('tr.data_emissao >= :dataInicio', {
                dataInicio: filtros.dataInicio,
            });
        }

        if (filtros.dataFim) {
            queryDespesas.andWhere('tp.data_emissao <= :dataFim', {
                dataFim: filtros.dataFim,
            });
            queryReceitas.andWhere('tr.data_emissao <= :dataFim', {
                dataFim: filtros.dataFim,
            });
        }

        // Filtro por pessoa
        if (filtros.pessoaId) {
            queryDespesas.andWhere('tp.pessoa_id = :pessoaId', {
                pessoaId: filtros.pessoaId,
            });
            queryReceitas.andWhere('tr.pessoa_id = :pessoaId', {
                pessoaId: filtros.pessoaId,
            });
        }

        // Executar queries conforme o filtro de tipo
        let despesas: TituloPagar[] = [];
        let receitas: TituloReceber[] = [];

        if (!filtros.tipo || filtros.tipo === TipoFluxo.DESPESA) {
            despesas = await queryDespesas
                .orderBy('tp.data_emissao', 'DESC')
                .getMany();
        }

        if (!filtros.tipo || filtros.tipo === TipoFluxo.RECEITA) {
            receitas = await queryReceitas
                .orderBy('tr.data_emissao', 'DESC')
                .getMany();
        }

        // Unificar em lista de fluxo de caixa
        const itensFluxo: ItemFluxoCaixa[] = [
            ...despesas.map((d) => ({
                id: d.id,
                tipo: 'DESPESA' as const,
                descricao: d.descricao,
                pessoaNome: d.pessoa?.nome || '',
                valorTotal: Number(d.valorTotal),
                dataEmissao: d.dataEmissao,
                dataVencimento: d.dataVencimento,
                status: d.status,
                operacaoDescricao: d.operacao?.descricao || null,
            })),
            ...receitas.map((r) => ({
                id: r.id,
                tipo: 'RECEITA' as const,
                descricao: r.descricao,
                pessoaNome: r.pessoa?.nome || '',
                valorTotal: Number(r.valorTotal),
                dataEmissao: r.dataEmissao,
                dataVencimento: r.dataVencimento,
                status: r.status,
                operacaoDescricao: r.operacao?.descricao || null,
            })),
        ];

        // Ordenar por data de emissão (mais recente primeiro)
        itensFluxo.sort(
            (a, b) =>
                new Date(b.dataEmissao).getTime() - new Date(a.dataEmissao).getTime(),
        );

        // Paginação
        const totalItens = itensFluxo.length;
        const totalPaginas = Math.ceil(totalItens / itensPorPagina);
        const offset = (pagina - 1) * itensPorPagina;
        const dados = itensFluxo.slice(offset, offset + itensPorPagina);

        // Totais filtrados
        const totalReceitasFiltrado = itensFluxo
            .filter((i) => i.tipo === 'RECEITA')
            .reduce((sum, i) => sum + i.valorTotal, 0);

        const totalDespesasFiltrado = itensFluxo
            .filter((i) => i.tipo === 'DESPESA')
            .reduce((sum, i) => sum + i.valorTotal, 0);

        return {
            dados,
            paginacao: {
                pagina,
                itensPorPagina,
                totalItens,
                totalPaginas,
            },
            totais: {
                receitas: totalReceitasFiltrado,
                despesas: totalDespesasFiltrado,
                saldo: totalReceitasFiltrado - totalDespesasFiltrado,
            },
        };
    }
}
