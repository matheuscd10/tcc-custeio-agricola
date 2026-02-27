import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { TituloReceber } from './titulo-receber.entity.js';
import { TipoValorFinanceiro } from '../../operacao/entities/tipo-valor-financeiro.entity.js';

@Entity('valor_titulo_receber')
export class ValorTituloReceber {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TituloReceber, (t) => t.valores, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'titulo_id' })
    titulo: TituloReceber;

    @Column({ name: 'titulo_id' })
    tituloId: number;

    @ManyToOne(() => TipoValorFinanceiro, { eager: true, nullable: true })
    @JoinColumn({ name: 'tipo_valor_id' })
    tipoValor: TipoValorFinanceiro;

    @Column({ name: 'tipo_valor_id', nullable: true })
    tipoValorId: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    valor: number;

    @Column({ type: 'date', name: 'data_vencimento', nullable: true })
    dataVencimento: Date;

    @Column({ length: 200, nullable: true })
    descricao: string;
}
