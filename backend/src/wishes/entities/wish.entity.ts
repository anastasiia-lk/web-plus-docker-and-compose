import { IsUrl, Length } from 'class-validator';
import { Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { Base } from 'src/utils/entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

export class NumberConverter {
  to(item: number): number {
    return item;
  }

  from(item: string): number {
    return parseFloat(item);
  }
}

@Entity()
export class Wish extends Base {
  // name
  @Column()
  @Length(1, 250)
  name: string;

  // link
  @Column()
  @IsUrl()
  link: string;

  // image
  @Column()
  @IsUrl()
  image: string;

  // price
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new NumberConverter(),
  })
  price: number;

  // raised
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new NumberConverter(),
  })
  raised: number;

  // owner
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  // description
  @Column()
  @Length(1, 1024)
  description: string;

  // offers
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  // copied
  @Column({ default: 0 })
  copied: number;
}
