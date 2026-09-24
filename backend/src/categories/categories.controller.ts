import { Controller, Get } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { DataStoreService } from '../data/data-store.service.js';
import type { Category } from '../domain/types.js';

@ApiTags('categories')
@ApiHeader({ name: 'X-Demo-User', required: true })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly store: DataStoreService) {}

  @Get()
  findAll(): Category[] {
    return this.store.categories;
  }
}
