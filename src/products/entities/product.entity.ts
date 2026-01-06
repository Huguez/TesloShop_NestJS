import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

   @PrimaryGeneratedColumn('uuid')
   @ApiProperty()
   id: string

   @Column('text', {
      unique: true,
   })
   @ApiProperty()
   title: string;

   @Column('float', {
      default: 0.0
   })
   @ApiProperty()
   price: number

   @Column({
      type: 'text',
      nullable: true,
   })
   @ApiProperty()
   description: string

   @Column('text', {
      unique: true,
   })
   @ApiProperty()
   slug: string;

   @Column('int', {
      default: 0,
   })
   @ApiProperty()
   stock: number;

   @Column('text', {
      array: true,
      default: []
   })
   @ApiProperty()
   tags: string[];

   @Column('text', {
      array: true,
   })
   @ApiProperty()
   sizes: string[]

   @Column('text')
   @ApiProperty()
   gender: string;

   @OneToMany( 
      () => ProductImage,
      ( productImage ) => productImage.product,
      { cascade: true, eager: true }
   )
   @ApiProperty()
   images?: ProductImage[];


   @ManyToOne(
      () => User,
      (user: User) => user.product,
      { eager: true }
   )
   @ApiProperty()
   user: User;

   @BeforeInsert()
   checkSlug() {
      if (!this.slug) {
         this.slug = this.title;
      }

      this.slug = this.slug
         .toLocaleLowerCase()
         .replaceAll(" ", "_")
         .replaceAll("'", "")
   }

   @BeforeUpdate()
   updatedSlug() {
      this.slug = this.slug
         .toLocaleLowerCase()
         .replaceAll(" ", "_")
         .replaceAll("'", "")
   }
}
