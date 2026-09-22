import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsNumber()
  category_id: number;
}
