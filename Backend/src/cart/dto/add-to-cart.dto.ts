import { IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
