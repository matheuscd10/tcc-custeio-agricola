import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('banco')
export class Banco {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 5, unique: true })
    codigo: string;

    @Column({ length: 150 })
    nome: string;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}
