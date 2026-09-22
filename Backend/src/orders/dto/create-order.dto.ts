import { IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shipping_address: string;

  @IsString()
  @IsOptional()
  payment_method?: string;
}
