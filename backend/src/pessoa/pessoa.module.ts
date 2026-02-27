import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaService } from './pessoa.service.js';
import { PessoaController } from './pessoa.controller.js';
import { Pessoa } from './entities/pessoa.entity.js';
import { PessoaFisica } from './entities/pessoa-fisica.entity.js';
import { PessoaJuridica } from './entities/pessoa-juridica.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Pessoa, PessoaFisica, PessoaJuridica])],
    controllers: [PessoaController],
    providers: [PessoaService],
    exports: [PessoaService],
})
export class PessoaModule { }
