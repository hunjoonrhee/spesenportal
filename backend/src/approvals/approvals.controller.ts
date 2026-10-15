import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/current-user.decorator.js';
import { DataStoreService } from '../data/data-store.service.js';
import type { Expense, User } from '../domain/types.js';
import { RejectExpenseDto } from './dto/reject-expense.dto.js';

@ApiTags('approvals')
@ApiHeader({ name: 'X-Demo-User', required: true })
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly store: DataStoreService) {}

  /** Offene Einreichungen aus den Kostenstellen, für die der Nutzer verantwortlich ist. */
  @Get('pending')
  pending(@CurrentUser() user: User): Expense[] {
    const responsible = this.store.costCenters
      .filter((c) => c.responsibleUserId === user.id)
      .map((c) => c.id);
    return this.store.expenses.filter(
      (e) => e.status === 'SUBMITTED' && responsible.includes(e.costCenterId),
    );
  }

  @Post(':expenseId/approve')
  @HttpCode(200)
  approve(
    @CurrentUser() user: User,
    @Param('expenseId') expenseId: string,
  ): Expense {
    if (user.role !== 'APPROVER')
      throw new ForbiddenException('Nur Genehmigende dürfen genehmigen');
    const expense = this.store.expenses.find((e) => e.id === expenseId);
    if (!expense)
      throw new NotFoundException(`Ausgabe ${expenseId} nicht gefunden`);
    if (expense.status !== 'SUBMITTED')
      throw new BadRequestException(
        'Nur eingereichte Ausgaben können genehmigt werden',
      );
    expense.status = 'APPROVED';
    expense.decidedAt = new Date().toISOString();
    expense.decidedBy = user.id;
    return expense;
  }

  @Post(':expenseId/reject')
  @HttpCode(200)
  @ApiOperation({ summary: 'Eingereichte Ausgabe mit Begründung ablehnen' })
  @ApiOkResponse({
    description:
      'Ausgabe mit Status REJECTED, decidedAt, decidedBy und rejectionReason',
  })
  @ApiBadRequestResponse({
    description:
      'Begründung fehlt oder ist nicht 5–300 Zeichen lang, oder Status ist nicht SUBMITTED',
  })
  @ApiForbiddenResponse({ description: 'Nutzer hat nicht die Rolle APPROVER' })
  @ApiNotFoundResponse({ description: 'Ausgabe existiert nicht' })
  reject(
    @CurrentUser() user: User,
    @Param('expenseId') expenseId: string,
    @Body() dto: RejectExpenseDto,
  ): Expense {
    if (user.role !== 'APPROVER')
      throw new ForbiddenException('Nur Genehmigende dürfen ablehnen');
    const expense = this.store.expenses.find((e) => e.id === expenseId);
    if (!expense)
      throw new NotFoundException(`Ausgabe ${expenseId} nicht gefunden`);
    if (expense.status !== 'SUBMITTED')
      throw new BadRequestException(
        'Nur eingereichte Ausgaben können abgelehnt werden',
      );
    expense.status = 'REJECTED';
    expense.rejectionReason = dto.reason;
    expense.decidedAt = new Date().toISOString();
    expense.decidedBy = user.id;
    return expense;
  }
}
