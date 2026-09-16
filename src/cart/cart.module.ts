import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
