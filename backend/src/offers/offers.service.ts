import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Offer } from './entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    const { price, raised, owner } = wish;

    if (owner.id === userId) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }

    if (amount + raised > price) {
      throw new ForbiddenException(
        'Сумма взноса превышает сумму остатка стоимости подарка',
      );
    }

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: { id: userId },
      item: { id: itemId },
    });

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.insert<Offer>(Offer, offer);
      await transactionalEntityManager.update<Wish>(Wish, itemId, {
        raised: raised + amount,
      });
    });

    return {};
  }

  getOffers() {
    return this.offerRepository.find({
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }

  getById(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }
}
