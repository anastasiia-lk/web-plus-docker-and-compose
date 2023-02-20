import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

export interface RequestWithUser extends Request {
  user: User;
}
export const GROUP_USER = 'GROUP_USER';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.getByUsername(username);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.getAnotherUserWishes(username);
  }

  @Post('find')
  findByUserNameOrEmail(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    return this.usersService.findByUsernameOrEmail(query);
  }

  @Get('me')
  @SerializeOptions({ groups: [GROUP_USER] })
  getUser(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('me/wishes')
  getMyWishes(@Req() req: RequestWithUser) {
    return this.usersService.getUserWishes(req.user.id);
  }

  @Patch('me')
  @SerializeOptions({ groups: [GROUP_USER] })
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }
}
