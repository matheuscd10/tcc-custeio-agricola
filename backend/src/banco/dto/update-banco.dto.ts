import { PartialType } from '@nestjs/swagger';
import { CreateBancoDto, CreateDadosBancariosDto } from './create-banco.dto.js';

export class UpdateBancoDto extends PartialType(CreateBancoDto) { }

export class UpdateDadosBancariosDto extends PartialType(
    CreateDadosBancariosDto,
) { }
