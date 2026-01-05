import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

   constructor(
      @InjectRepository(User)
      private readonly userR: Repository<User>,
      configService: ConfigService
   ){
      super({
         secretOrKey: configService.getOrThrow("SECRET_KEY_JWT"),
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      });
   }

   async validate( { email }: JwtPayload ): Promise<User> {
      
      const user = await this.userR.findOneBy({ email })

      if ( !user ) {
         throw new Error("Validate Error - user not found");
      }

      if ( !user.isActivated ) {
         throw new Error("Validate Error - user not Active");
      }

      return user;
   }
}