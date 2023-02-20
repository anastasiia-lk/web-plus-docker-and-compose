import {
  Body,
  Controller,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from './local-auth.guard';

export interface RequestWithUser extends Request {
  user: User;
}
export const GROUP_USER = 'group_user_details';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: RequestWithUser) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @SerializeOptions({ groups: [GROUP_USER] })
  async signup(@Body() createUserDto: CreateUserDto) {
    const { about, ...rest } = createUserDto;
    const dto = (about === '' ? rest : createUserDto) as CreateUserDto;

    const user = await this.userService.create(dto);
    return user;
  }
}
