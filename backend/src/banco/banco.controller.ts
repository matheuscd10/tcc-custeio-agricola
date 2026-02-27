import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { BancoService } from './banco.service.js';
import { CreateBancoDto, CreateDadosBancariosDto } from './dto/create-banco.dto.js';
import { UpdateBancoDto, UpdateDadosBancariosDto } from './dto/update-banco.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Bancos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bancos')
export class BancoController {
    constructor(private readonly bancoService: BancoService) { }

    // ========== BANCO ==========

    @Post()
    @ApiOperation({ summary: 'Cadastrar novo banco' })
    @ApiResponse({ status: 201, description: 'Banco cadastrado' })
    createBanco(@Body() dto: CreateBancoDto) {
        return this.bancoService.createBanco(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os bancos' })
    findAllBancos() {
        return this.bancoService.findAllBancos();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar banco por ID' })
    @ApiResponse({ status: 404, description: 'Banco não encontrado' })
    findOneBanco(@Param('id', ParseIntPipe) id: number) {
        return this.bancoService.findOneBanco(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar banco' })
    updateBanco(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBancoDto,
    ) {
        return this.bancoService.updateBanco(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover banco' })
    removeBanco(@Param('id', ParseIntPipe) id: number) {
        return this.bancoService.removeBanco(id);
    }

    // ========== DADOS BANCÁRIOS ==========

    @Post('dados-bancarios')
    @ApiOperation({ summary: 'Cadastrar dados bancários' })
    @ApiResponse({ status: 201, description: 'Dados bancários cadastrados' })
    createDadosBancarios(@Body() dto: CreateDadosBancariosDto) {
        return this.bancoService.createDadosBancarios(dto);
    }

    @Get('dados-bancarios/todos')
    @ApiOperation({ summary: 'Listar todos os dados bancários' })
    findAllDadosBancarios() {
        return this.bancoService.findAllDadosBancarios();
    }

    @Get('dados-bancarios/pessoa/:pessoaId')
    @ApiOperation({ summary: 'Listar dados bancários de uma pessoa' })
    findDadosBancariosByPessoa(@Param('pessoaId', ParseIntPipe) pessoaId: number) {
        return this.bancoService.findDadosBancariosByPessoa(pessoaId);
    }

    @Get('dados-bancarios/:id')
    @ApiOperation({ summary: 'Buscar dados bancários por ID' })
    findOneDadosBancarios(@Param('id', ParseIntPipe) id: number) {
        return this.bancoService.findOneDadosBancarios(id);
    }

    @Put('dados-bancarios/:id')
    @ApiOperation({ summary: 'Atualizar dados bancários' })
    updateDadosBancarios(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDadosBancariosDto,
    ) {
        return this.bancoService.updateDadosBancarios(id, dto);
    }

    @Delete('dados-bancarios/:id')
    @ApiOperation({ summary: 'Remover dados bancários' })
    removeDadosBancarios(@Param('id', ParseIntPipe) id: number) {
        return this.bancoService.removeDadosBancarios(id);
    }
}
