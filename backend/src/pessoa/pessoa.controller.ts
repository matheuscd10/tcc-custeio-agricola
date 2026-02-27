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
import { PessoaService } from './pessoa.service.js';
import { CreatePessoaDto } from './dto/create-pessoa.dto.js';
import { UpdatePessoaDto } from './dto/update-pessoa.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Pessoas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pessoas')
export class PessoaController {
    constructor(private readonly pessoaService: PessoaService) { }

    @Post()
    @ApiOperation({ summary: 'Cadastrar nova pessoa' })
    @ApiResponse({ status: 201, description: 'Pessoa cadastrada com sucesso' })
    create(@Body() createPessoaDto: CreatePessoaDto) {
        return this.pessoaService.create(createPessoaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as pessoas' })
    @ApiResponse({ status: 200, description: 'Lista de pessoas' })
    findAll() {
        return this.pessoaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar pessoa por ID' })
    @ApiResponse({ status: 200, description: 'Pessoa encontrada' })
    @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pessoaService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar pessoa' })
    @ApiResponse({ status: 200, description: 'Pessoa atualizada com sucesso' })
    @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePessoaDto: UpdatePessoaDto,
    ) {
        return this.pessoaService.update(id, updatePessoaDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover pessoa' })
    @ApiResponse({ status: 200, description: 'Pessoa removida com sucesso' })
    @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.pessoaService.remove(id);
    }
}
