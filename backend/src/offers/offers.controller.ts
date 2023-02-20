import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OffersService } from './offers.service';

import { CreateOfferDto } from './dto/create-offer.dto';

import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/jwt.guard';

export interface RequestWithUser extends Request {
  user: User;
}

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: RequestWithUser) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  getOffers() {
    return this.offersService.getOffers();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.offersService.getById(+id);
  }
}
