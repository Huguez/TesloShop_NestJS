import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashSync } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

   private readonly logger = new Logger("AuthService");
   
   constructor(
      @InjectRepository(User)
      private readonly userR: Repository<User>
   ) { }

   async login( loginUserDto: LoginUserDto ) {
      try {

         

      } catch (error) {
         this.handleException( error )
      }
   }

   async sigIn(createAuthDto: CreateUserDto) {
      try {
         const { password, ...userData } = createAuthDto

         // ToDo: Check if user already exist

         const user = await this.userR.create( {
            ...userData, 
            password: hashSync( password, 2 )
         } )
         
         return await this.userR.save( user )
      } catch (error) {
         this.handleException( error )
      }
   }
   
   
   private handleException(error: any): never {

      if ( error.code === '23505' ) {
         throw new BadRequestException( error.detail )
      }

      this.logger.error( error );
      throw new InternalServerErrorException( "unexpected error, check logs" )
   }
}
