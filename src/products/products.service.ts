import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

   private readonly logger = new Logger("ProductsService");

   constructor(
      @InjectRepository(Product)
      private readonly productR: Repository<Product>,
      @InjectRepository(ProductImage)
      private readonly productImageR: Repository<ProductImage>,
      private readonly dataSource: DataSource
   ) { }

   async create(createProductDto: CreateProductDto) {
      try {
         const { images = [], ...pd } = createProductDto

         const product = this.productR.create({
            ...pd,
            images: images.map( img => this.productImageR.create( { url: img } ) )
         });
         await this.productR.save(product);
         return { ...product, images: product.images?.map( img => img.url ) };
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

   async findOne(term: string) {
      try {
         let product:Product | null = null;

         if ( isUUID( term ) ) {
            product = await this.productR.findOneBy({ id: term })
         }else {
            const query = this.productR.createQueryBuilder('product');
            product = await query.where('slug =:slug', { slug: term.toLowerCase() })
               .leftJoinAndSelect( 'product.images', 'prodImages' )
               .getOne()
         }

         if (!product) {
            throw new NotFoundException(`Product with id: ${ term }, not found`);
         }

         return {
            ...product,
            images: product.images?.map( img => img.url )
         }
      } catch (error) {
         this.handleExceptions(error);
      }
   }

   async findAll( pagination: PaginationDto ) {
      try {
         const { page = 1, size = 10 } = pagination

         const products = await this.productR.find({
            take: size,
            skip: page,
            relations: {
               images: true,
            }
         })

         return products.map( p => ({
            ...p,
            images: p.images?.map( img => img.url )
         }) )
      } catch (error) {
         this.handleExceptions(error);
      }
   }

   async update( id: string, updateProductDto: UpdateProductDto ){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction()

      try {
         const { images, ...dto } = updateProductDto

         const product = await this.productR.preload({
            id,
            ...dto,
            images: [],
         });
         
         if (!product) {
            throw new NotFoundException(`Product with id: ${ id } not found`);
         }
          
         if ( images ) {
            await queryRunner.manager.delete( ProductImage, { product: { id } } ) 

            product.images = images.map( img => this.productImageR.create( { url: img } ) )
         }else{
            product.images = await this.productImageR.findBy( { product: { id } } )
         }

         await queryRunner.manager.save( product );

         await queryRunner.commitTransaction();
         await queryRunner.release();

         return product
      } catch (error) {
         await queryRunner.rollbackTransaction();
         await queryRunner.release();
         this.handleExceptions( error );
      }
   }

   private handleExceptions(error: any) {
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
