import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/shared/user.service';
import { JwtService } from '@nestjs/jwt';
import { Console } from 'console';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser(username: any, password: String): Promise<any>{
            let user;
            if(isNaN(username)){
                user = await this.usersService.getByEmail(username);
            } else {
                user = await this.usersService.getByCpfCnpj(Number.parseInt(username));
            }
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
            username: user._id,
            sub: user._id,
         };
        return {
          id: user._id,
          name: user.name,
          access_token: this.jwtService.sign(payload),
        };
      }

}
