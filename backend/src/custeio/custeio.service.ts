import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TituloPagar, StatusTitulo } from './entities/titulo-pagar.entity.js';
import { TituloReceber } from './entities/titulo-receber.entity.js';
import { BaixaTituloPagar } from './entities/baixa-titulo-pagar.entity.js';
import { BaixaTituloReceber } from './entities/baixa-titulo-receber.entity.js';
import {
    CreateTituloPagarDto,
    CreateTituloReceberDto,
    CreateBaixaPagarDto,
    CreateBaixaReceberDto,
} from './dto/create-custeio.dto.js';
import {
    UpdateTituloPagarDto,
    UpdateTituloReceberDto,
} from './dto/update-custeio.dto.js';

@Injectable()
export class CusteioService {
    constructor(
        @InjectRepository(TituloPagar)
        private readonly tituloPagarRepo: Repository<TituloPagar>,
        @InjectRepository(TituloReceber)
        private readonly tituloReceberRepo: Repository<TituloReceber>,
        @InjectRepository(BaixaTituloPagar)
        private readonly baixaPagarRepo: Repository<BaixaTituloPagar>,
        @InjectRepository(BaixaTituloReceber)
        private readonly baixaReceberRepo: Repository<BaixaTituloReceber>,
    ) { }

    // ========== CONTAS A PAGAR ==========

    async createTituloPagar(dto: CreateTituloPagarDto): Promise<TituloPagar> {
        const titulo = this.tituloPagarRepo.create(dto);
        return this.tituloPagarRepo.save(titulo);
    }

    async findAllTitulosPagar(): Promise<TituloPagar[]> {
        return this.tituloPagarRepo.find({
            relations: ['pessoa', 'operacao', 'valores', 'baixas'],
            order: { dataVencimento: 'ASC' },
        });
    }

    async findOneTituloPagar(id: number): Promise<TituloPagar> {
        const titulo = await this.tituloPagarRepo.findOne({
            where: { id },
            relations: ['pessoa', 'operacao', 'valores', 'baixas'],
        });
        if (!titulo) {
            throw new NotFoundException(`Título a pagar com ID ${id} não encontrado`);
        }
        return titulo;
    }

    async updateTituloPagar(id: number, dto: UpdateTituloPagarDto): Promise<TituloPagar> {
        const titulo = await this.findOneTituloPagar(id);
        Object.assign(titulo, dto);
        return this.tituloPagarRepo.save(titulo);
    }

    async removeTituloPagar(id: number): Promise<void> {
        const titulo = await this.findOneTituloPagar(id);
        await this.tituloPagarRepo.remove(titulo);
    }

    // ========== CONTAS A RECEBER ==========

    async createTituloReceber(dto: CreateTituloReceberDto): Promise<TituloReceber> {
        const titulo = this.tituloReceberRepo.create(dto);
        return this.tituloReceberRepo.save(titulo);
    }

    async findAllTitulosReceber(): Promise<TituloReceber[]> {
        return this.tituloReceberRepo.find({
            relations: ['pessoa', 'operacao', 'valores', 'baixas'],
            order: { dataVencimento: 'ASC' },
        });
    }

    async findOneTituloReceber(id: number): Promise<TituloReceber> {
        const titulo = await this.tituloReceberRepo.findOne({
            where: { id },
            relations: ['pessoa', 'operacao', 'valores', 'baixas'],
        });
        if (!titulo) {
            throw new NotFoundException(`Título a receber com ID ${id} não encontrado`);
        }
        return titulo;
    }

    async updateTituloReceber(id: number, dto: UpdateTituloReceberDto): Promise<TituloReceber> {
        const titulo = await this.findOneTituloReceber(id);
        Object.assign(titulo, dto);
        return this.tituloReceberRepo.save(titulo);
    }

    async removeTituloReceber(id: number): Promise<void> {
        const titulo = await this.findOneTituloReceber(id);
        await this.tituloReceberRepo.remove(titulo);
    }

    // ========== BAIXA - CONTAS A PAGAR ==========

    async baixarTituloPagar(dto: CreateBaixaPagarDto): Promise<BaixaTituloPagar> {
        const titulo = await this.findOneTituloPagar(dto.tituloId);

        if (titulo.status === StatusTitulo.PAGO) {
            throw new BadRequestException('Este título já foi totalmente pago');
        }

        if (titulo.status === StatusTitulo.CANCELADO) {
            throw new BadRequestException('Este título está cancelado');
        }

        // Criar a baixa
        const baixa = this.baixaPagarRepo.create(dto);
        const baixaSalva = await this.baixaPagarRepo.save(baixa);

        // Calcular total pago
        const baixas = await this.baixaPagarRepo.find({
            where: { tituloId: titulo.id },
        });
        const totalPago = baixas.reduce(
            (sum, b) => sum + Number(b.valorPago),
            0,
        );

        // Atualizar status do título
        if (totalPago >= Number(titulo.valorTotal)) {
            titulo.status = StatusTitulo.PAGO;
        } else {
            titulo.status = StatusTitulo.PARCIAL;
        }
        await this.tituloPagarRepo.save(titulo);

        return baixaSalva;
    }

    // ========== BAIXA - CONTAS A RECEBER ==========

    async baixarTituloReceber(dto: CreateBaixaReceberDto): Promise<BaixaTituloReceber> {
        const titulo = await this.findOneTituloReceber(dto.tituloId);

        if (titulo.status === StatusTitulo.PAGO) {
            throw new BadRequestException('Este título já foi totalmente recebido');
        }

        if (titulo.status === StatusTitulo.CANCELADO) {
            throw new BadRequestException('Este título está cancelado');
        }

        // Criar a baixa
        const baixa = this.baixaReceberRepo.create(dto);
        const baixaSalva = await this.baixaReceberRepo.save(baixa);

        // Calcular total recebido
        const baixas = await this.baixaReceberRepo.find({
            where: { tituloId: titulo.id },
        });
        const totalRecebido = baixas.reduce(
            (sum, b) => sum + Number(b.valorRecebido),
            0,
        );

        // Atualizar status do título
        if (totalRecebido >= Number(titulo.valorTotal)) {
            titulo.status = StatusTitulo.PAGO;
        } else {
            titulo.status = StatusTitulo.PARCIAL;
        }
        await this.tituloReceberRepo.save(titulo);

        return baixaSalva;
    }
}
