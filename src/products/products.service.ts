import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

   async remove(id: string) {
      try {
         await this.findOne(id)
         const { affected } = await this.productR.delete({ id })
         return !!affected && affected > 0
      } catch (error) {
         this.handleExceptions(error);
      }
   }

   async findOne(id: string) {
      try {
         const product = await this.productR.findOneBy({ id })

         if (!product) {
            throw new NotFoundException(`Product with id: ${id}, not found`);
         }

         return product
      } catch (error) {
         this.handleExceptions(error);
      }
   }

   async findAll( pagination: PaginationDto ) {
      try {
         const { page = 1, size = 10 } = pagination

         return await this.productR.find({
            take: size,
            skip: page,
         })
      } catch (error) {
         this.handleExceptions(error);
      }
   }


   handleExceptions(error: any) {
      if (error.code === '23505') {
         throw new BadRequestException(error.detail);
      }

      if ( error.status === HttpStatus.NOT_FOUND ) {
         throw new NotFoundException( error.response )
      }
      
      this.logger.error(error)
      throw new InternalServerErrorException("Unexpected Error, check logs");
   }

}
