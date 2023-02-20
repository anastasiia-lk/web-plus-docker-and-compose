import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from 'src/utils/entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

export class NumberConverter {
  to(item: number): number {
    return item;
  }

  from(item: string): number {
    return parseFloat(item);
  }
}

@Entity()
export class Offer extends Base {
  // user
  @ManyToOne(() => User, (user) => user.offers)
  user: User;
  // item
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
  // amount
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new NumberConverter(),
  })
  amount: number;
  // hidden flag
  @Column({ default: false })
  hidden: boolean;
}
