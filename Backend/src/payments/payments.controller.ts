import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(req.user.id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.complete(id);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.findByOrder(orderId);
  }
}
