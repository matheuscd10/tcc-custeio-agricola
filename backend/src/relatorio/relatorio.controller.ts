import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { RelatorioService } from './relatorio.service.js';
import { FiltroRelatorioDto } from './dto/filtro-relatorio.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Relatórios e Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('relatorios')
export class RelatorioController {
    constructor(private readonly relatorioService: RelatorioService) { }

    @Get('dashboard')
    @ApiOperation({
        summary: 'Resumo financeiro para a Dashboard',
        description:
            'Retorna totais de receitas, despesas, saldo, percentual de orçamento utilizado e contagens de títulos.',
    })
    @ApiResponse({
        status: 200,
        description: 'Resumo financeiro',
        schema: {
            example: {
                totalReceitas: 50000,
                totalDespesas: 32000,
                saldo: 18000,
                percentualOrcamentoUtilizado: 64,
                totalTitulosPagar: 15,
                totalTitulosReceber: 8,
                titulosPagarAbertos: 5,
                titulosReceberAbertos: 3,
            },
        },
    })
    getDashboard() {
        return this.relatorioService.getResumoDashboard();
    }

    @Get('fluxo-caixa')
    @ApiOperation({
        summary: 'Relatório detalhado do fluxo de caixa',
        description:
            'Lista unificada de receitas e despesas com filtros opcionais por data, tipo e pessoa. Suporta paginação.',
    })
    @ApiResponse({
        status: 200,
        description: 'Relatório com dados paginados e totais filtrados',
        schema: {
            example: {
                dados: [
                    {
                        id: 1,
                        tipo: 'DESPESA',
                        descricao: 'Compra de fertilizantes',
                        pessoaNome: 'Agro Insumos Ltda',
                        valorTotal: 3000,
                        dataEmissao: '2025-03-01',
                        dataVencimento: '2025-04-01',
                        status: 'ABERTO',
                        operacaoDescricao: 'Compra de Insumos',
                    },
                ],
                paginacao: {
                    pagina: 1,
                    itensPorPagina: 20,
                    totalItens: 1,
                    totalPaginas: 1,
                },
                totais: {
                    receitas: 0,
                    despesas: 3000,
                    saldo: -3000,
                },
            },
        },
    })
    getFluxoCaixa(@Query() filtros: FiltroRelatorioDto) {
        return this.relatorioService.getRelatorioDetalhado(filtros);
    }
}
