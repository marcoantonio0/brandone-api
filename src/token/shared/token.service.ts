import { TokenModel } from './token.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel('Token') private readonly tokenModel: Model<TokenModel>,

    ) { }

    async create(data) {
        try {
            const tokenString = crypto.randomBytes(6).toString('hex');
            const jsontoken = {
                type: data.type,
                id: data.id,
                token: tokenString
            }
            const token = new this.tokenModel(jsontoken);
            return await token.save();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição, verifique os campos e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getToken(token: string) {
        const gettoken = await this.tokenModel.findOne({ token }).exec();
        if(gettoken.expired){
            return null;
        }
        const dateExpired = new Date(gettoken.expireAt).getTime();
        const dateNow =  Date.now();
        if(dateExpired <= dateNow){
            return null;
        }
        return gettoken;
    }

}
