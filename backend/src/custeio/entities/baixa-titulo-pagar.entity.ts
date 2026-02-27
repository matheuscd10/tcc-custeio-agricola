import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { TituloPagar } from './titulo-pagar.entity.js';
import { DadosBancarios } from '../../banco/entities/dados-bancarios.entity.js';

@Entity('baixa_titulo_pagar')
export class BaixaTituloPagar {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TituloPagar, (t) => t.baixas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'titulo_id' })
    titulo: TituloPagar;

    @Column({ name: 'titulo_id' })
    tituloId: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'valor_pago' })
    valorPago: number;

    @Column({ type: 'date', name: 'data_pagamento' })
    dataPagamento: Date;

    @ManyToOne(() => DadosBancarios, { eager: true, nullable: true })
    @JoinColumn({ name: 'dados_bancarios_id' })
    dadosBancarios: DadosBancarios;

    @Column({ name: 'dados_bancarios_id', nullable: true })
    dadosBancariosId: number;

    @Column({ type: 'text', nullable: true })
    observacao: string;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;
}
