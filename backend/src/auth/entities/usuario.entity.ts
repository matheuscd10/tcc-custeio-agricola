import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    nome: string;

    @Column({ unique: true, length: 150 })
    email: string;

    @Column()
    @Exclude() // Não expor a senha nas respostas JSON
    senha: string;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}
