import { PartialType, OmitType } from '@nestjs/swagger';
import {
    CreateTituloPagarDto,
    CreateTituloReceberDto,
} from './create-custeio.dto.js';

export class UpdateTituloPagarDto extends PartialType(
    OmitType(CreateTituloPagarDto, ['valores'] as const),
) { }

export class UpdateTituloReceberDto extends PartialType(
    OmitType(CreateTituloReceberDto, ['valores'] as const),
) { }
