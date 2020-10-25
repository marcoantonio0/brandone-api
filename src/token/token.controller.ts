import { TokenModel } from './shared/token.model';
import { TokenService } from './shared/token.service';
import { Body, Controller, Post } from '@nestjs/common';
import { create } from 'domain';

@Controller('token')
export class TokenController {
    constructor(
        private sToken: TokenService
    ){

    }

    @Post()
    async create(@Body() data: TokenModel){
        return this.sToken.create(data);
    }
}
