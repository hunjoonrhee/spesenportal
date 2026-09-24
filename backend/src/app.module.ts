import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApprovalsModule } from './approvals/approvals.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { DemoUserGuard } from './common/demo-user.guard.js';
import { CostCentersModule } from './cost-centers/cost-centers.module.js';
import { DataModule } from './data/data.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [DataModule, UsersModule, CategoriesModule, CostCentersModule, ExpensesModule, ApprovalsModule],
  providers: [{ provide: APP_GUARD, useClass: DemoUserGuard }],
})
export class AppModule {}
