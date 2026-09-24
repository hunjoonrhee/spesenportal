import { Module } from '@nestjs/common';
import { CostCentersController } from './cost-centers.controller.js';

@Module({ controllers: [CostCentersController] })
export class CostCentersModule {}
