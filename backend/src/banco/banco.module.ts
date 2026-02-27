import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BancoService } from './banco.service.js';
import { BancoController } from './banco.controller.js';
import { Banco } from './entities/banco.entity.js';
import { DadosBancarios } from './entities/dados-bancarios.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Banco, DadosBancarios])],
    controllers: [BancoController],
    providers: [BancoService],
    exports: [BancoService],
})
export class BancoModule { }
