import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ========== VALORES ==========

export class CreateValorTituloDto {
    @ApiPropertyOptional({ example: 1, description: 'ID do tipo de valor financeiro' })
    @IsOptional()
    @IsNumber()
    tipoValorId?: number;

    @ApiProperty({ example: 1500.0 })
    @IsNumber()
    valor: number;

    @ApiPropertyOptional({ example: '2025-04-15' })
    @IsOptional()
    @IsDateString()
    dataVencimento?: string;

    @ApiPropertyOptional({ example: 'Parcela 1' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    descricao?: string;
}

// ========== TÍTULO PAGAR ==========

export class CreateTituloPagarDto {
    @ApiPropertyOptional({ example: 'NF-001' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numeroDocumento?: string;

    @ApiProperty({ example: 'Compra de fertilizantes' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    descricao: string;

    @ApiProperty({ example: 1, description: 'ID da pessoa (fornecedor)' })
    @IsNumber()
    pessoaId: number;

    @ApiPropertyOptional({ example: 1, description: 'ID da operação financeira' })
    @IsOptional()
    @IsNumber()
    operacaoId?: number;

    @ApiProperty({ example: 3000.0 })
    @IsNumber()
    valorTotal: number;

    @ApiProperty({ example: '2025-03-01' })
    @IsDateString()
    dataEmissao: string;

    @ApiProperty({ example: '2025-04-01' })
    @IsDateString()
    dataVencimento: string;

    @ApiPropertyOptional({ example: 'Pagamento em 2 parcelas' })
    @IsOptional()
    @IsString()
    observacao?: string;

    @ApiPropertyOptional({ type: [CreateValorTituloDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateValorTituloDto)
    valores?: CreateValorTituloDto[];
}

// ========== TÍTULO RECEBER ==========

export class CreateTituloReceberDto {
    @ApiPropertyOptional({ example: 'NF-002' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numeroDocumento?: string;

    @ApiProperty({ example: 'Venda de soja - safra 2025' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    descricao: string;

    @ApiProperty({ example: 2, description: 'ID da pessoa (comprador)' })
    @IsNumber()
    pessoaId: number;

    @ApiPropertyOptional({ example: 2, description: 'ID da operação financeira' })
    @IsOptional()
    @IsNumber()
    operacaoId?: number;

    @ApiProperty({ example: 15000.0 })
    @IsNumber()
    valorTotal: number;

    @ApiProperty({ example: '2025-03-15' })
    @IsDateString()
    dataEmissao: string;

    @ApiProperty({ example: '2025-05-15' })
    @IsDateString()
    dataVencimento: string;

    @ApiPropertyOptional({ example: 'Recebimento após colheita' })
    @IsOptional()
    @IsString()
    observacao?: string;

    @ApiPropertyOptional({ type: [CreateValorTituloDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateValorTituloDto)
    valores?: CreateValorTituloDto[];
}

// ========== BAIXAS ==========

export class CreateBaixaPagarDto {
    @ApiProperty({ example: 1, description: 'ID do título a pagar' })
    @IsNumber()
    tituloId: number;

    @ApiProperty({ example: 1500.0 })
    @IsNumber()
    valorPago: number;

    @ApiProperty({ example: '2025-04-01' })
    @IsDateString()
    dataPagamento: string;

    @ApiPropertyOptional({ example: 1, description: 'ID dos dados bancários' })
    @IsOptional()
    @IsNumber()
    dadosBancariosId?: number;

    @ApiPropertyOptional({ example: 'Pagamento via PIX' })
    @IsOptional()
    @IsString()
    observacao?: string;
}

export class CreateBaixaReceberDto {
    @ApiProperty({ example: 1, description: 'ID do título a receber' })
    @IsNumber()
    tituloId: number;

    @ApiProperty({ example: 15000.0 })
    @IsNumber()
    valorRecebido: number;

    @ApiProperty({ example: '2025-05-15' })
    @IsDateString()
    dataRecebimento: string;

    @ApiPropertyOptional({ example: 1, description: 'ID dos dados bancários' })
    @IsOptional()
    @IsNumber()
    dadosBancariosId?: number;

    @ApiPropertyOptional({ example: 'Depósito em conta' })
    @IsOptional()
    @IsString()
    observacao?: string;
}
