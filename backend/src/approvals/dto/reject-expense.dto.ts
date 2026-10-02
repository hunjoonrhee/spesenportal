import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RejectExpenseDto {
  @ApiProperty({
    example: 'Beleg fehlt, bitte nachreichen',
    minLength: 5,
    maxLength: 300,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Begründung ist Pflicht' })
  @MinLength(5, { message: 'Begründung muss mindestens 5 Zeichen lang sein' })
  @MaxLength(300, {
    message: 'Begründung darf höchstens 300 Zeichen lang sein',
  })
  reason: string;
}
