import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import type { Currency } from '../../domain/types.js';

export class CreateExpenseDto {
  @ApiProperty({ example: '2026-09-21' })
  @IsISO8601({ strict: true })
  date: string;

  @ApiProperty({ example: 'cat-02' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 89.9 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: ['EUR', 'CHF', 'USD'] })
  @IsIn(['EUR', 'CHF', 'USD'])
  currency: Currency;

  @ApiProperty({ example: 'cc-1110' })
  @IsString()
  costCenterId: string;

  @ApiProperty({ example: 'Kundentermin Hamburg – Bahnfahrt' })
  @IsString()
  @MaxLength(200)
  description: string;

  @ApiProperty({ required: false, description: 'true = direkt einreichen, sonst Entwurf' })
  @IsOptional()
  submit?: boolean;
}
