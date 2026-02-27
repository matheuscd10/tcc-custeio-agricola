import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Cadastrar novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
    @ApiResponse({ status: 409, description: 'Email já cadastrado' })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Realizar login e obter token JWT' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Perfil do usuário' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user.id);
    }
}
