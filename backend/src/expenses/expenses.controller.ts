import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/current-user.decorator.js';
import type { Expense, Page, User } from '../domain/types.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { ListExpensesQuery } from './dto/list-expenses.query.js';
import { ExpensesService } from './expenses.service.js';

@ApiTags('expenses')
@ApiHeader({ name: 'X-Demo-User', required: true })
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expenses: ExpensesService) {}

  @Get()
  findMine(@CurrentUser() user: User, @Query() query: ListExpensesQuery): Page<Expense> {
    return this.expenses.findMine(user, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string): Expense {
    return this.expenses.findOne(user, id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateExpenseDto): Expense {
    return this.expenses.create(user, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Entwurf ändern (alle Felder optional, unbekannte Felder werden verworfen)' })
  @ApiOkResponse({ description: 'Aktualisierte Ausgabe' })
  @ApiBadRequestResponse({ description: 'Ungültige Werte, unbekannte Kategorie/Kostenstelle oder Status ≠ DRAFT' })
  update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateExpenseDto): Expense {
    return this.expenses.update(user, id, dto);
  }

  @Post(':id/submit')
  @HttpCode(200)
  submit(@CurrentUser() user: User, @Param('id') id: string): Expense {
    return this.expenses.submit(user, id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: User, @Param('id') id: string): void {
    this.expenses.remove(user, id);
  }
}
