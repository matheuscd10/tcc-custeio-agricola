import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Banco } from './banco.entity.js';
import { Pessoa } from '../../pessoa/entities/pessoa.entity.js';

@Entity('dados_bancarios')
export class DadosBancarios {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pessoa, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pessoa_id' })
    pessoa: Pessoa;

    @Column({ name: 'pessoa_id' })
    pessoaId: number;

    @ManyToOne(() => Banco, { eager: true })
    @JoinColumn({ name: 'banco_id' })
    banco: Banco;

    @Column({ name: 'banco_id' })
    bancoId: number;

    @Column({ length: 10 })
    agencia: string;

    @Column({ length: 20, name: 'numero_conta' })
    numeroConta: string;

    @Column({ length: 30, nullable: true, name: 'tipo_conta' })
    tipoConta: string;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}
