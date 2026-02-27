import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banco } from './entities/banco.entity.js';
import { DadosBancarios } from './entities/dados-bancarios.entity.js';
import { CreateBancoDto, CreateDadosBancariosDto } from './dto/create-banco.dto.js';
import { UpdateBancoDto, UpdateDadosBancariosDto } from './dto/update-banco.dto.js';

@Injectable()
export class BancoService {
    constructor(
        @InjectRepository(Banco)
        private readonly bancoRepository: Repository<Banco>,
        @InjectRepository(DadosBancarios)
        private readonly dadosBancariosRepository: Repository<DadosBancarios>,
    ) { }

    // ========== BANCO ==========

    async createBanco(dto: CreateBancoDto): Promise<Banco> {
        const banco = this.bancoRepository.create(dto);
        return this.bancoRepository.save(banco);
    }

    async findAllBancos(): Promise<Banco[]> {
        return this.bancoRepository.find({ order: { codigo: 'ASC' } });
    }

    async findOneBanco(id: number): Promise<Banco> {
        const banco = await this.bancoRepository.findOne({ where: { id } });
        if (!banco) {
            throw new NotFoundException(`Banco com ID ${id} não encontrado`);
        }
        return banco;
    }

    async updateBanco(id: number, dto: UpdateBancoDto): Promise<Banco> {
        const banco = await this.findOneBanco(id);
        Object.assign(banco, dto);
        return this.bancoRepository.save(banco);
    }

    async removeBanco(id: number): Promise<void> {
        const banco = await this.findOneBanco(id);
        await this.bancoRepository.remove(banco);
    }

    // ========== DADOS BANCÁRIOS ==========

    async createDadosBancarios(dto: CreateDadosBancariosDto): Promise<DadosBancarios> {
        const dados = this.dadosBancariosRepository.create(dto);
        return this.dadosBancariosRepository.save(dados);
    }

    async findAllDadosBancarios(): Promise<DadosBancarios[]> {
        return this.dadosBancariosRepository.find({
            relations: ['pessoa', 'banco'],
        });
    }

    async findDadosBancariosByPessoa(pessoaId: number): Promise<DadosBancarios[]> {
        return this.dadosBancariosRepository.find({
            where: { pessoaId },
            relations: ['banco'],
        });
    }

    async findOneDadosBancarios(id: number): Promise<DadosBancarios> {
        const dados = await this.dadosBancariosRepository.findOne({
            where: { id },
            relations: ['pessoa', 'banco'],
        });
        if (!dados) {
            throw new NotFoundException(`Dados bancários com ID ${id} não encontrados`);
        }
        return dados;
    }

    async updateDadosBancarios(id: number, dto: UpdateDadosBancariosDto): Promise<DadosBancarios> {
        const dados = await this.findOneDadosBancarios(id);
        Object.assign(dados, dto);
        return this.dadosBancariosRepository.save(dados);
    }

    async removeDadosBancarios(id: number): Promise<void> {
        const dados = await this.findOneDadosBancarios(id);
        await this.dadosBancariosRepository.remove(dados);
    }
}
