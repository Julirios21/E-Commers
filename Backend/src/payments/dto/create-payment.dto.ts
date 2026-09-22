import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  order_id: number;

  @IsString()
  method: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  reference?: string;
}
