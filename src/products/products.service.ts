import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

   private readonly logger = new Logger("ProductsService");

   constructor(
      @InjectRepository(Product)
      private readonly productR: Repository<Product>
   ) { }


   async create(createProductDto: CreateProductDto) {
      try {
         
         const product = this.productR.create(createProductDto);
         await this.productR.save(product);
         return product;
      } catch (error) {
         this.handleExceptions(error);
      }

   }

   handleExceptions(error: any) {
      if (error.code === '23505') {
         throw new BadRequestException(error.detail);
      }
      this.logger.error(error)
      throw new InternalServerErrorException("Unexpected Error, check logs");
   }

}
