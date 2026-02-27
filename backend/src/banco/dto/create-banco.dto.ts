import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBancoDto {
    @ApiProperty({ example: '001' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5)
    codigo: string;

    @ApiProperty({ example: 'Banco do Brasil' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    nome: string;
}

export class CreateDadosBancariosDto {
    @ApiProperty({ example: 1, description: 'ID da pessoa' })
    @IsNotEmpty()
    pessoaId: number;

    @ApiProperty({ example: 1, description: 'ID do banco' })
    @IsNotEmpty()
    bancoId: number;

    @ApiProperty({ example: '1234' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    agencia: string;

    @ApiProperty({ example: '12345-6' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    numeroConta: string;

    @ApiPropertyOptional({ example: 'Conta Corrente' })
    @IsString()
    @IsOptional()
    @MaxLength(30)
    tipoConta?: string;
}
