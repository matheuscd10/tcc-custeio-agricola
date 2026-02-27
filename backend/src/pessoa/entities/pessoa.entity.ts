import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { PessoaFisica } from './pessoa-fisica.entity.js';
import { PessoaJuridica } from './pessoa-juridica.entity.js';

export enum TipoPessoa {
    FISICA = 'FISICA',
    JURIDICA = 'JURIDICA',
}

@Entity('pessoa')
export class Pessoa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    nome: string;

    @Column({ type: 'enum', enum: TipoPessoa })
    tipo: TipoPessoa;

    @Column({ length: 150, nullable: true })
    email: string;

    @Column({ length: 20, nullable: true })
    telefone: string;

    @Column({ length: 200, nullable: true })
    endereco: string;

    @Column({ length: 100, nullable: true })
    cidade: string;

    @Column({ length: 2, nullable: true })
    uf: string;

    @Column({ length: 10, nullable: true })
    cep: string;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;

    // Relacionamentos com especializações
    @OneToOne(() => PessoaFisica, (pf) => pf.pessoa, { cascade: true, eager: true })
    pessoaFisica: PessoaFisica;

    @OneToOne(() => PessoaJuridica, (pj) => pj.pessoa, { cascade: true, eager: true })
    pessoaJuridica: PessoaJuridica;
}
