import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoPessoa } from '../entities/pessoa.entity.js';

export class CreatePessoaFisicaDto {
    @ApiProperty({ example: '123.456.789-00' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(14)
    cpf: string;

    @ApiPropertyOptional({ example: '12.345.678-9' })
    @IsString()
    @IsOptional()
    @MaxLength(12)
    rg?: string;

    @ApiPropertyOptional({ example: '1990-05-15' })
    @IsOptional()
    dataNascimento?: Date;
}

export class CreatePessoaJuridicaDto {
    @ApiProperty({ example: '12.345.678/0001-90' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(18)
    cnpj: string;

    @ApiPropertyOptional({ example: 'Fazenda São João Ltda' })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    razaoSocial?: string;

    @ApiPropertyOptional({ example: 'Fazenda São João' })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    nomeFantasia?: string;

    @ApiPropertyOptional({ example: '123456789' })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    inscricaoEstadual?: string;
}

export class CreatePessoaDto {
    @ApiProperty({ example: 'João da Silva' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    nome: string;

    @ApiProperty({ enum: TipoPessoa, example: TipoPessoa.FISICA })
    @IsEnum(TipoPessoa)
    tipo: TipoPessoa;

    @ApiPropertyOptional({ example: 'joao@email.com' })
    @IsString()
    @IsOptional()
    @MaxLength(150)
    email?: string;

    @ApiPropertyOptional({ example: '(54) 99999-0000' })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    telefone?: string;

    @ApiPropertyOptional({ example: 'Rua Principal, 100' })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    endereco?: string;

    @ApiPropertyOptional({ example: 'Nonoai' })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    cidade?: string;

    @ApiPropertyOptional({ example: 'RS' })
    @IsString()
    @IsOptional()
    @MaxLength(2)
    uf?: string;

    @ApiPropertyOptional({ example: '99600-000' })
    @IsString()
    @IsOptional()
    @MaxLength(10)
    cep?: string;

    @ApiPropertyOptional({ type: CreatePessoaFisicaDto })
    @ValidateNested()
    @Type(() => CreatePessoaFisicaDto)
    @IsOptional()
    pessoaFisica?: CreatePessoaFisicaDto;

    @ApiPropertyOptional({ type: CreatePessoaJuridicaDto })
    @ValidateNested()
    @Type(() => CreatePessoaJuridicaDto)
    @IsOptional()
    pessoaJuridica?: CreatePessoaJuridicaDto;
}
