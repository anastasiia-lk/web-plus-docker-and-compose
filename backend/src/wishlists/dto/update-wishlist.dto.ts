import { IsArray, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
