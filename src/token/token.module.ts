import { TokenController } from './token.controller';
import { TokenSchema } from './schema/token.schema';
import { TokenService } from './shared/token.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
    ],
    controllers: [
        TokenController,],
    providers: [
        TokenService
    ],
    exports: [TokenService]
})
export class TokenModule { }
