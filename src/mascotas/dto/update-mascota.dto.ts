import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateMascotaDto } from './create-mascota.dto';

export class UpdateMascotaDto extends PartialType(
  OmitType(CreateMascotaDto, ['userId'] as const),
) {}