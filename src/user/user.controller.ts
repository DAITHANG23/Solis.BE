import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
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
import type { User } from 'generated/prisma';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('user')
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
  @Patch('updateUser')
  updateUser(@GetUser('id') userId: string, @Body() dto: UserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
