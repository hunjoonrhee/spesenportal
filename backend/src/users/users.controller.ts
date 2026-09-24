import { Controller, Get } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/current-user.decorator.js';
import { Public } from '../common/public.decorator.js';
import { DataStoreService } from '../data/data-store.service.js';
import type { User } from '../domain/types.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly store: DataStoreService) {}

  /** Für den Demo-Login-Screen. */
  @Public()
  @Get()
  findAll(): User[] {
    return this.store.users;
  }

  @ApiHeader({ name: 'X-Demo-User', required: true })
  @Get('me')
  me(@CurrentUser() user: User): User {
    return user;
  }
}
