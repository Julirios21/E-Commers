import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(120)
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}
