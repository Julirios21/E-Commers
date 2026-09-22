import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addItem(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch(':id')
  updateItem(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, id, dto);
  }

  @Delete(':id')
  removeItem(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(req.user.id, id);
  }

  @Delete()
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
