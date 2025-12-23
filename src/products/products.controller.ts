import { Controller, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductsController {

   constructor(
      private readonly productsService: ProductsService
   ) { }

   @Post()
   create(@Body() createProductDto: CreateProductDto) {
      return this.productsService.create(createProductDto);
   }
}
