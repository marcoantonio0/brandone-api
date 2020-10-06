import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserModel>){}

    async getAll(){
        return await this.userModel.find().exec();
    }

    async getById(id: string){
        return await this.userModel.findById(id).exec();
    }

    async getByEmail(email: string){
        return await this.userModel.findOne({ email }).exec();
    }
    
    async getByCpfCnpj(cpfcnpj: number){
        return await this.userModel.findOne({ cpfcnpj }).exec();
    }

    async create(user) {
        const hashPassword = await bcrypt.hash(user.password, 10);
        try {
            const createUser = new this.userModel({
                ...user,
                password: hashPassword,
                roles: ['customer']
            });
            return await createUser.save(user);
        } catch(error) {
            if(error.code === 11000 && error.keyPattern.username == 1){
                throw new HttpException('Este e-mail já está cadastrado!', HttpStatus.BAD_REQUEST);
            }
            if(error.code === 11000 && error.keyPattern.cpfcnpj == 1){
                throw new HttpException('Este CPF/CNPJ já está cadastrado!', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Houve um erro ao executar sua requisição, verifique os campos e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
       
    }


    async update(id: string, user: UserModel){
        try {
            await this.userModel.updateOne({ _id: id }, user).exec();
            return this.getById(id);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string){
        try {
            return await this.userModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
