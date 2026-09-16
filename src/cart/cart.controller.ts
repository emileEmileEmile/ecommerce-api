import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@Req() req: Request) {
        return this.cartService.getOrCreateCart(req.user!.userId);
    }

    @Post('items')
    addItem(@Req() req: Request, @Body() dto: AddToCartDto) {
        return this.cartService.addItem(req.user!.userId, dto);
    }

    @Patch('items/:productId')
    updateItemQuantity(@Req() req: Request, @Body() dto: UpdateCartItemDto, @Param('productId') prodId: string) {
        return this.cartService.updateItemQuantity(req.user!.userId, +prodId, dto)
    }

    @Delete('items/:productId')
    removeItem(@Req() req: Request, @Param('productId') prodId: string) {
        return this.cartService.removeItem(req.user!.userId, +prodId);
    }







}


