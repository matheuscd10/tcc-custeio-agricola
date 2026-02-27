import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity.js';
import { OperacaoFinanceira } from '../../operacao/entities/operacao-financeira.entity.js';
import { ValorTituloReceber } from './valor-titulo-receber.entity.js';
import { BaixaTituloReceber } from './baixa-titulo-receber.entity.js';
import { StatusTitulo } from './titulo-pagar.entity.js';

@Entity('titulo_receber')
export class TituloReceber {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, name: 'numero_documento', nullable: true })
    numeroDocumento: string;

    @Column({ length: 200 })
    descricao: string;

    @ManyToOne(() => Pessoa, { eager: true })
    @JoinColumn({ name: 'pessoa_id' })
    pessoa: Pessoa;

    @Column({ name: 'pessoa_id' })
    pessoaId: number;

    @ManyToOne(() => OperacaoFinanceira, { eager: true, nullable: true })
    @JoinColumn({ name: 'operacao_id' })
    operacao: OperacaoFinanceira;

    @Column({ name: 'operacao_id', nullable: true })
    operacaoId: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'valor_total' })
    valorTotal: number;

    @Column({ type: 'date', name: 'data_emissao' })
    dataEmissao: Date;

    @Column({ type: 'date', name: 'data_vencimento' })
    dataVencimento: Date;

    @Column({ type: 'enum', enum: StatusTitulo, default: StatusTitulo.ABERTO })
    status: StatusTitulo;

    @Column({ type: 'text', nullable: true })
    observacao: string;

    @OneToMany(() => ValorTituloReceber, (v) => v.titulo, { cascade: true, eager: true })
    valores: ValorTituloReceber[];

    @OneToMany(() => BaixaTituloReceber, (b) => b.titulo, { cascade: true })
    baixas: BaixaTituloReceber[];

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}
