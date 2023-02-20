import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';
import { CreateWishListDto } from './dto/create-wishlist.dto';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
export interface RequestWithUser extends Request {
  user: User;
}

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishListDto,
    @Req() req: RequestWithUser,
  ) {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  getWishlists() {
    return this.wishlistsService.getWishlists();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishlistsService.getById(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: RequestWithUser,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.wishlistsService.delete(+id, req.user.id);
  }
}
