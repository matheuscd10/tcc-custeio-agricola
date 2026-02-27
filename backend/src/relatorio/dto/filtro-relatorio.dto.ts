import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoFluxo {
    RECEITA = 'RECEITA',
    DESPESA = 'DESPESA',
}

export class FiltroRelatorioDto {
    @ApiPropertyOptional({ example: '2025-01-01', description: 'Data inicial' })
    @IsOptional()
    @IsDateString()
    dataInicio?: string;

    @ApiPropertyOptional({ example: '2025-12-31', description: 'Data final' })
    @IsOptional()
    @IsDateString()
    dataFim?: string;

    @ApiPropertyOptional({ enum: TipoFluxo, description: 'Filtrar por tipo' })
    @IsOptional()
    @IsEnum(TipoFluxo)
    tipo?: TipoFluxo;

    @ApiPropertyOptional({ example: 1, description: 'Filtrar por pessoa' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    pessoaId?: number;

    @ApiPropertyOptional({ example: 1, description: 'Página', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    pagina?: number;

    @ApiPropertyOptional({ example: 20, description: 'Itens por página', default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    itensPorPagina?: number;
}
