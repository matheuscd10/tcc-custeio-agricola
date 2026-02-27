import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Matheus Chagas' })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({ example: 'matheus@email.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'senha123', minLength: 6 })
    @IsString()
    @MinLength(6)
    senha: string;
}
