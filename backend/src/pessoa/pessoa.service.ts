import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity.js';
import { CreatePessoaDto } from './dto/create-pessoa.dto.js';
import { UpdatePessoaDto } from './dto/update-pessoa.dto.js';

@Injectable()
export class PessoaService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
    ) { }

    async create(createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
        const pessoa = this.pessoaRepository.create(createPessoaDto);
        return this.pessoaRepository.save(pessoa);
    }

    async findAll(): Promise<Pessoa[]> {
        return this.pessoaRepository.find({
            relations: ['pessoaFisica', 'pessoaJuridica'],
        });
    }

    async findOne(id: number): Promise<Pessoa> {
        const pessoa = await this.pessoaRepository.findOne({
            where: { id },
            relations: ['pessoaFisica', 'pessoaJuridica'],
        });

        if (!pessoa) {
            throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
        }

        return pessoa;
    }

    async update(id: number, updatePessoaDto: UpdatePessoaDto): Promise<Pessoa> {
        const pessoa = await this.findOne(id);

        // Merge dos dados atualizados
        Object.assign(pessoa, updatePessoaDto);

        // Atualizar especializações se fornecidas
        if (updatePessoaDto.pessoaFisica && pessoa.pessoaFisica) {
            Object.assign(pessoa.pessoaFisica, updatePessoaDto.pessoaFisica);
        }

        if (updatePessoaDto.pessoaJuridica && pessoa.pessoaJuridica) {
            Object.assign(pessoa.pessoaJuridica, updatePessoaDto.pessoaJuridica);
        }

        return this.pessoaRepository.save(pessoa);
    }

    async remove(id: number): Promise<void> {
        const pessoa = await this.findOne(id);
        await this.pessoaRepository.remove(pessoa);
    }
}
