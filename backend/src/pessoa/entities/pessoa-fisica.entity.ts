import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Pessoa } from './pessoa.entity.js';

@Entity('pessoa_fisica')
export class PessoaFisica {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 14, unique: true })
    cpf: string;

    @Column({ length: 12, nullable: true })
    rg: string;

    @Column({ type: 'date', nullable: true, name: 'data_nascimento' })
    dataNascimento: Date;

    @OneToOne(() => Pessoa, (pessoa) => pessoa.pessoaFisica, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'pessoa_id' })
    pessoa: Pessoa;
}
