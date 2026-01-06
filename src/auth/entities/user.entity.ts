import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("Users")
export class User {

   @PrimaryGeneratedColumn('uuid')
   @ApiProperty()
   id: string;

   @Column('text', {
      unique: true
   })
   @ApiProperty()
   username: string

   @Column('text', {
      unique: true,
   })
   @ApiProperty()
   email: string;

   @Column('text', {
      select: false,
   })
   @ApiProperty()
   password: string;

   @Column('bool', {
      default: true,
   })
   @ApiProperty()
   isActivated: boolean;

   @Column('text', {
      array: true,
      default: [ 'standard' ]
   })
   @ApiProperty()
   roles: string[];

   @OneToMany(
      ()=> Product,
      ( product: Product ) => product.user
   )
   product: Product;

   @BeforeInsert()
   checkUpperCase(){
      this.email = this.email.toLowerCase().trim();
   }

   @BeforeUpdate()
   checkUpperCaseUpdate(){
      this.checkUpperCase()
   }

}
