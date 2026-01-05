import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Users")
export class User {

   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('text', {
      unique: true
   })
   username: string

   @Column('text', {
      unique: true,
   })
   email: string;

   @Column('text')
   password: string;

   @Column('bool', {
      default: true,
   })
   isActived: boolean;

   @Column('text', {
      array: true,
      default: [ 'standard' ]
   })
   roles: string[];
}
