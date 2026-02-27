import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'matheus@email.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'senha123' })
    @IsString()
    @IsNotEmpty()
    senha: string;
}
