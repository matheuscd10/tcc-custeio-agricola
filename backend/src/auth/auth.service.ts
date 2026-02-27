import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { nome, email, senha } = registerDto;

        // Verificar se o email já existe
        const existente = await this.usuarioRepository.findOne({
            where: { email },
        });

        if (existente) {
            throw new ConflictException('Email já cadastrado');
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Criar usuário
        const usuario = this.usuarioRepository.create({
            nome,
            email,
            senha: senhaHash,
        });

        await this.usuarioRepository.save(usuario);

        return {
            message: 'Usuário cadastrado com sucesso',
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
        };
    }

    async login(loginDto: LoginDto) {
        const { email, senha } = loginDto;

        // Buscar usuário pelo email
        const usuario = await this.usuarioRepository.findOne({
            where: { email },
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // Gerar token JWT
        const payload = { sub: usuario.id, email: usuario.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
        };
    }

    async getProfile(userId: number) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: userId },
        });

        if (!usuario) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        return {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            ativo: usuario.ativo,
            criadoEm: usuario.criadoEm,
        };
    }
}
