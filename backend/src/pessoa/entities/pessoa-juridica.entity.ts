import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Pessoa } from './pessoa.entity.js';

@Entity('pessoa_juridica')
export class PessoaJuridica {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 18, unique: true })
    cnpj: string;

    @Column({ length: 200, nullable: true, name: 'razao_social' })
    razaoSocial: string;

    @Column({ length: 200, nullable: true, name: 'nome_fantasia' })
    nomeFantasia: string;

    @Column({ length: 20, nullable: true, name: 'inscricao_estadual' })
    inscricaoEstadual: string;

    @OneToOne(() => Pessoa, (pessoa) => pessoa.pessoaJuridica, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'pessoa_id' })
    pessoa: Pessoa;
}
