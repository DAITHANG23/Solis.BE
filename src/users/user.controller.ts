import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import type { User } from '../../prisma/generated/client';
import { UserDto } from './dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiBearerAuth()
  @Get('me')
  @ApiCreatedResponse({
    description: 'Get user object as response',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'User cannot get information. Try again!',
  })
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiBearerAuth()
  @Patch()
  updateUser(@GetUser('id') userId: string, @Body() dto: UserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
