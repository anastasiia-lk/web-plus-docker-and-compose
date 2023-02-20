import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, FindOneOptions } from 'typeorm';
import { Wish } from './entities/wish.entity';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, ownerId: number) {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  getLastWishes() {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  getTopWishes() {
    return this.wishesRepository.find({ order: { copied: 'DESC' }, take: 10 });
  }

  getById(id: number) {
    return this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    return this.wishesRepository.update(id, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }

    this.wishesRepository.delete(id);
    return wish;
  }

  async copy(wishId: number, userId: number) {
    const wish = await this.wishesRepository.findOne({ where: { id: wishId } });

    const { name, description, image, link, price, copied } = wish;

    const isCreatedWish = !!(await this.findOne({
      where: {
        name,
        link,
        price,
        owner: { id: userId },
      },
      relations: { owner: true },
    }));

    if (isCreatedWish) {
      throw new ForbiddenException('Вы уже копировали себе этот подарок');
    }

    const wishCopy = {
      name,
      description,
      image,
      link,
      price,
      owner: { id: userId },
    };

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update<Wish>(Wish, wishId, {
        copied: copied + 1,
      });

      await transactionalEntityManager.insert<Wish>(Wish, wishCopy);
    });

    return {};
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }
}
