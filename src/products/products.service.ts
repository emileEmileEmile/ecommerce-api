import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(private prisma : PrismaService) {}

  async create(createProductDto: CreateProductDto) {

    const product = await this.prisma.product.create({
      data : {
        name : createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        categoryId: createProductDto.categoryId,

      }
    });
    
    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany();

    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: id},

    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const updateProduct = await this.prisma.product.update({
          where: {id: id},
          data: updateProductDto ,
    });

   
    return updateProduct;
  }

  async remove(id: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: id},

    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    
    const product = await this.prisma.product.delete({
      where: {id: id},
    });
    return product;
  }
}
