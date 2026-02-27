import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { TituloReceber } from './titulo-receber.entity.js';
import { DadosBancarios } from '../../banco/entities/dados-bancarios.entity.js';

@Entity('baixa_titulo_receber')
export class BaixaTituloReceber {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TituloReceber, (t) => t.baixas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'titulo_id' })
    titulo: TituloReceber;

    @Column({ name: 'titulo_id' })
    tituloId: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'valor_recebido' })
    valorRecebido: number;

    @Column({ type: 'date', name: 'data_recebimento' })
    dataRecebimento: Date;

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
