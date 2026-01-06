import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashSync, compareSync } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

   private readonly logger = new Logger("AuthService");

   constructor(
      @InjectRepository(User)
      private readonly userR: Repository<User>,
      private readonly jwtService: JwtService
   ) { }

   async login(loginUserDto: LoginUserDto) {
      try {
         const { email, password } = loginUserDto

         const user = await this.userR.findOne({
            where: { email, isActivated: true },
            select: { password: true, username: true, email: true, roles: true }
         })

         if (!user) {
            throw new UnauthorizedException(`e-mail ${email} isn't register.`);
         }

         if (!compareSync(password, user.password)) {
            throw new UnauthorizedException(`Invalid credentials`);
         }

         return {
            user,
            token: this.generateJWT({ email: user.email }),
         };

      } catch (error) {
         this.handleException(error)
      }
   }

   async sigIn(createAuthDto: CreateUserDto) {
      try {
         const { password, ...userData } = createAuthDto

         const userExist = await this.userR.findOneBy({ email: userData.email })

         if (userExist) {
            throw new BadRequestException(`e-mail ${userData.email} is already registered`);
         }

         const newUser = await this.userR.create({
            ...userData,
            password: hashSync(password, 2)
         })

         return {
            user: await this.userR.save(newUser),
            token: this.generateJWT({ email: newUser.email }),
         }
      } catch (error) {
         this.handleException(error)
      }
   }

   async checkStatus(user: User) {
      try {

         return {
            user,
            token: this.generateJWT({ email: user.email }),
         }
      } catch (error) {
         this.handleException(error)
      }

   }

   private handleException(error: any): never {

      if (error.code === '23505' || error.status === 400) {
         throw new BadRequestException(error.detail ?? error.message)
      }

      if (error.status === 401) {
         throw new UnauthorizedException(error.message)
      }

      this.logger.error(error);
      throw new InternalServerErrorException("unexpected error, check logs")
   }

   private generateJWT(payload: JwtPayload) {
      return this.jwtService.sign({ ...payload })
   }
}
