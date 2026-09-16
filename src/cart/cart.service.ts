import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getOrCreateCart(userId: number) {

        let cart = await this.prisma.cart.findUnique({
            where: { userId: userId, },
            include: { items: { include: { product: true } } },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: { items: { include: { product: true } } },
            });
        }
        return cart;
    }

    async addItem(userId: number, dto: AddToCartDto) {
        const cart = await this.getOrCreateCart(userId);

        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId, },
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${dto.productId} not found`);
        }

        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId,
                },
            },
        });

        if (existingItem) {
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + dto.quantity },
            });
        }

        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: dto.productId,
                quantity: dto.quantity,
            },
        });

    }

    async removeItem(userId: number, productId: number) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId: userId },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId,
                },
            },
        });

        if (!cartItem) {
            throw new NotFoundException(`Product with id ${productId} not found in cart`);
        }
        return this.prisma.cartItem.delete({
            where: { id: cartItem.id },
        });
    }

    async updateItemQuantity(userId: number, productId: number, dto: UpdateCartItemDto) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId: userId },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId,
                },
            },
        });

        if (!cartItem) {
            throw new NotFoundException(`Product with id ${productId} not found in cart`);
        }

        return this.prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: dto.quantity },
        });
    }

}
