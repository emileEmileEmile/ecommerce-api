import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {

  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name : createCategoryDto.name,

      },
    });

    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const category = await this.prisma.category.create({
      data : {
        name : createCategoryDto.name,
      }
    });
    return category;
  }


  async findAll() {
    const categories = await this.prisma.category.findMany();


    return categories;
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: id, 
      },

    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      }
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const category = await this.prisma.category.update({
      where: {id:id},
      data : updateCategoryDto,
    });

    return category;
  }

  async remove(id: number) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      }
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    const category = await this.prisma.category.delete({
      where: { id:id, },
    });
    return category;
  }
}
