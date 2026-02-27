import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum TipoOperacao {
    RECEITA = 'RECEITA',
    DESPESA = 'DESPESA',
}

@Entity('operacao_financeira')
export class OperacaoFinanceira {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    descricao: string;

    @Column({ type: 'enum', enum: TipoOperacao })
    tipo: TipoOperacao;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}
