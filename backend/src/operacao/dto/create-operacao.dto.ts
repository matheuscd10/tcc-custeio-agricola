import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TipoOperacao } from '../entities/operacao-financeira.entity.js';

export class CreateTipoValorFinanceiroDto {
    @ApiProperty({ example: 'Dinheiro' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    descricao: string;
}

export class CreateOperacaoFinanceiraDto {
    @ApiProperty({ example: 'Venda de Soja' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    descricao: string;

    @ApiProperty({ enum: TipoOperacao, example: TipoOperacao.RECEITA })
    @IsEnum(TipoOperacao)
    tipo: TipoOperacao;
}
