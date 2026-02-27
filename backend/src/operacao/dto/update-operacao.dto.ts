import { PartialType } from '@nestjs/swagger';
import {
    CreateTipoValorFinanceiroDto,
    CreateOperacaoFinanceiraDto,
} from './create-operacao.dto.js';

export class UpdateTipoValorFinanceiroDto extends PartialType(
    CreateTipoValorFinanceiroDto,
) { }

export class UpdateOperacaoFinanceiraDto extends PartialType(
    CreateOperacaoFinanceiraDto,
) { }
