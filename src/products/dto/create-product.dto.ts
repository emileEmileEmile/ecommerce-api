import { IsString, IsInt, Min, MinLength, IsPositive, IsNumber, IsNotEmpty} from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @Min(0)
    @IsInt()
    stock: number;

    @IsInt()
    categoryId: number;




}
