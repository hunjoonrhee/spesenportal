import { Controller, Get } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { DataStoreService } from '../data/data-store.service.js';
import type { CostCenter } from '../domain/types.js';

@ApiTags('cost-centers')
@ApiHeader({ name: 'X-Demo-User', required: true })
@Controller('cost-centers')
export class CostCentersController {
  constructor(private readonly store: DataStoreService) {}

  /** Flache Liste mit parentId. Die Baumdarstellung baut der Client (siehe ADR-0005). */
  @Get()
  findAll(): CostCenter[] {
    return this.store.costCenters;
  }
}
