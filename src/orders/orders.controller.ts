import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Req() req: Request) {
    return this.ordersService.checkout(req.user!.userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.ordersService.findAllForUser(req.user!.userId);
  }
}