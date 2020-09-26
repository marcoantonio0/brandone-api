import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/shared/user.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser(username: string, password: String): Promise<any>{
            const user = await this.usersService.getByEmail(username);
            if(!user){
               return null;
            }
            const isPasswordMatching = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordMatching) {
               return null;
            }
            user.password = undefined;
            return user;
    }

    async login(user: any) {
        const payload = { 
            username: user.username,
            sub: user._id,
         };
        return {
          username: user.username,
          name: user.name,
          access_token: this.jwtService.sign(payload),
        };
      }

}
