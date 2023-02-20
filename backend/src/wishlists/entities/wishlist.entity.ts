import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Base } from 'src/utils/entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { PublicUserDto } from 'src/users/dto/public-user.dto';
import { PublicWishDto } from 'src/wishes/dto/public-wish.dto';
import { IsOptional, IsUrl, Length, MaxLength } from 'class-validator';

@Entity()
export class Wishlist extends Base {
  // name
  @Column()
  @Length(1, 250)
  name: string;
  // description
  @Column({ nullable: true })
  @MaxLength(1500)
  @IsOptional()
  description: string;
  // image
  @Column()
  @IsUrl()
  image: string;
  // items
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: PublicUserDto;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: PublicWishDto[];
}
