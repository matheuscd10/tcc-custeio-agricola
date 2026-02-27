import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { OperacaoService } from './operacao.service.js';
import {
    CreateTipoValorFinanceiroDto,
    CreateOperacaoFinanceiraDto,
} from './dto/create-operacao.dto.js';
import {
    UpdateTipoValorFinanceiroDto,
    UpdateOperacaoFinanceiraDto,
} from './dto/update-operacao.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Operações Financeiras')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class OperacaoController {
    constructor(private readonly operacaoService: OperacaoService) { }

    // ========== TIPO VALOR FINANCEIRO ==========

    @Post('tipos-valor')
    @ApiOperation({ summary: 'Criar tipo de valor financeiro' })
    @ApiResponse({ status: 201, description: 'Tipo criado' })
    createTipoValor(@Body() dto: CreateTipoValorFinanceiroDto) {
        return this.operacaoService.createTipoValor(dto);
    }

    @Get('tipos-valor')
    @ApiOperation({ summary: 'Listar tipos de valor financeiro' })
    findAllTipoValor() {
        return this.operacaoService.findAllTipoValor();
    }

    @Get('tipos-valor/:id')
    @ApiOperation({ summary: 'Buscar tipo de valor por ID' })
    findOneTipoValor(@Param('id', ParseIntPipe) id: number) {
        return this.operacaoService.findOneTipoValor(id);
    }

    @Put('tipos-valor/:id')
    @ApiOperation({ summary: 'Atualizar tipo de valor' })
    updateTipoValor(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTipoValorFinanceiroDto,
    ) {
        return this.operacaoService.updateTipoValor(id, dto);
    }

    @Delete('tipos-valor/:id')
    @ApiOperation({ summary: 'Remover tipo de valor' })
    removeTipoValor(@Param('id', ParseIntPipe) id: number) {
        return this.operacaoService.removeTipoValor(id);
    }

    // ========== OPERAÇÃO FINANCEIRA ==========

    @Post('operacoes')
    @ApiOperation({ summary: 'Criar operação financeira' })
    @ApiResponse({ status: 201, description: 'Operação criada' })
    createOperacao(@Body() dto: CreateOperacaoFinanceiraDto) {
        return this.operacaoService.createOperacao(dto);
    }

    @Get('operacoes')
    @ApiOperation({ summary: 'Listar operações financeiras' })
    findAllOperacoes() {
        return this.operacaoService.findAllOperacoes();
    }

    @Get('operacoes/:id')
    @ApiOperation({ summary: 'Buscar operação por ID' })
    findOneOperacao(@Param('id', ParseIntPipe) id: number) {
        return this.operacaoService.findOneOperacao(id);
    }

    @Put('operacoes/:id')
    @ApiOperation({ summary: 'Atualizar operação financeira' })
    updateOperacao(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateOperacaoFinanceiraDto,
    ) {
        return this.operacaoService.updateOperacao(id, dto);
    }

    @Delete('operacoes/:id')
    @ApiOperation({ summary: 'Remover operação financeira' })
    removeOperacao(@Param('id', ParseIntPipe) id: number) {
        return this.operacaoService.removeOperacao(id);
    }
}
