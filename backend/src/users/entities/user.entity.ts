import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Column, Entity, Unique, OneToMany } from 'typeorm';

import { Base } from 'src/utils/entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
export const GROUP_USER = 'group_user_details';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User extends Base {
  // name
  @Column()
  @Length(2, 30)
  username: string;

  // about
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  // avatar
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl()
  avatar: string;

  // email
  @Column()
  @Expose({ groups: [GROUP_USER] })
  @IsEmail()
  email: string;

  // password
  @Column()
  @Exclude()
  password: string;

  // wishes
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  // offers
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  // wishlists
  @OneToMany(() => Wishlist, (list) => list.owner)
  wishlists: Wishlist[];
}
