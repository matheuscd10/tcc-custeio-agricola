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
import { CusteioService } from './custeio.service.js';
import {
    CreateTituloPagarDto,
    CreateTituloReceberDto,
    CreateBaixaPagarDto,
    CreateBaixaReceberDto,
} from './dto/create-custeio.dto.js';
import {
    UpdateTituloPagarDto,
    UpdateTituloReceberDto,
} from './dto/update-custeio.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CusteioController {
    constructor(private readonly custeioService: CusteioService) { }

    // ========== CONTAS A PAGAR ==========

    @ApiTags('Contas a Pagar')
    @Post('titulos-pagar')
    @ApiOperation({ summary: 'Lançar conta a pagar (despesa)' })
    @ApiResponse({ status: 201, description: 'Título criado' })
    createTituloPagar(@Body() dto: CreateTituloPagarDto) {
        return this.custeioService.createTituloPagar(dto);
    }

    @ApiTags('Contas a Pagar')
    @Get('titulos-pagar')
    @ApiOperation({ summary: 'Listar contas a pagar' })
    findAllTitulosPagar() {
        return this.custeioService.findAllTitulosPagar();
    }

    @ApiTags('Contas a Pagar')
    @Get('titulos-pagar/:id')
    @ApiOperation({ summary: 'Buscar conta a pagar por ID' })
    findOneTituloPagar(@Param('id', ParseIntPipe) id: number) {
        return this.custeioService.findOneTituloPagar(id);
    }

    @ApiTags('Contas a Pagar')
    @Put('titulos-pagar/:id')
    @ApiOperation({ summary: 'Atualizar conta a pagar' })
    updateTituloPagar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTituloPagarDto,
    ) {
        return this.custeioService.updateTituloPagar(id, dto);
    }

    @ApiTags('Contas a Pagar')
    @Delete('titulos-pagar/:id')
    @ApiOperation({ summary: 'Remover conta a pagar' })
    removeTituloPagar(@Param('id', ParseIntPipe) id: number) {
        return this.custeioService.removeTituloPagar(id);
    }

    // ========== CONTAS A RECEBER ==========

    @ApiTags('Contas a Receber')
    @Post('titulos-receber')
    @ApiOperation({ summary: 'Lançar conta a receber (receita)' })
    @ApiResponse({ status: 201, description: 'Título criado' })
    createTituloReceber(@Body() dto: CreateTituloReceberDto) {
        return this.custeioService.createTituloReceber(dto);
    }

    @ApiTags('Contas a Receber')
    @Get('titulos-receber')
    @ApiOperation({ summary: 'Listar contas a receber' })
    findAllTitulosReceber() {
        return this.custeioService.findAllTitulosReceber();
    }

    @ApiTags('Contas a Receber')
    @Get('titulos-receber/:id')
    @ApiOperation({ summary: 'Buscar conta a receber por ID' })
    findOneTituloReceber(@Param('id', ParseIntPipe) id: number) {
        return this.custeioService.findOneTituloReceber(id);
    }

    @ApiTags('Contas a Receber')
    @Put('titulos-receber/:id')
    @ApiOperation({ summary: 'Atualizar conta a receber' })
    updateTituloReceber(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTituloReceberDto,
    ) {
        return this.custeioService.updateTituloReceber(id, dto);
    }

    @ApiTags('Contas a Receber')
    @Delete('titulos-receber/:id')
    @ApiOperation({ summary: 'Remover conta a receber' })
    removeTituloReceber(@Param('id', ParseIntPipe) id: number) {
        return this.custeioService.removeTituloReceber(id);
    }

    // ========== BAIXAS (CONCILIAÇÃO) ==========

    @ApiTags('Conciliação / Baixas')
    @Post('baixas/pagar')
    @ApiOperation({ summary: 'Registrar pagamento (baixa de título a pagar)' })
    @ApiResponse({ status: 201, description: 'Pagamento registrado' })
    @ApiResponse({ status: 400, description: 'Título já pago ou cancelado' })
    baixarPagar(@Body() dto: CreateBaixaPagarDto) {
        return this.custeioService.baixarTituloPagar(dto);
    }

    @ApiTags('Conciliação / Baixas')
    @Post('baixas/receber')
    @ApiOperation({ summary: 'Registrar recebimento (baixa de título a receber)' })
    @ApiResponse({ status: 201, description: 'Recebimento registrado' })
    @ApiResponse({ status: 400, description: 'Título já recebido ou cancelado' })
    baixarReceber(@Body() dto: CreateBaixaReceberDto) {
        return this.custeioService.baixarTituloReceber(dto);
    }
}
