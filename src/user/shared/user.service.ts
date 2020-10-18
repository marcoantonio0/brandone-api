import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user';
import { query } from 'express';
import { MailService } from 'src/mailer/mail.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserModel>,
        private sMail: MailService
        ){}

    async getAll(querys){
        const select = 'email name menu submenu cpfcnpj roles';
        let users;
        let count;
        let offset = parseInt(querys.offset) || 0;
        if(Object.keys(querys).length != 0){
            let query = {};
            if(querys.search) query['$text'] = { $search: querys.search };  
            if(querys.roles) query['roles'] =  { $in: querys.roles.split('-') };
            count = await this.userModel.find(query).populate('menu').countDocuments();
            users = await this.userModel.find(query).populate('menu').select(select).skip(offset).limit(20).exec();
        } else {
            count =  await this.userModel.find().populate('menu').estimatedDocumentCount();
            users = await this.userModel.find().populate('menu').select(select).skip(offset).limit(20).exec();
        }
        let usersAll = {};
        usersAll['total'] = count;
        usersAll['users'] = users;
        return usersAll;
    }

    async getById(id: string){
        const select = 'email name menu submenu cpfcnpj roles birthday createdAt updatedAt';
        return await this.userModel.findById(id).populate('menu').select(select).exec();
    }

    async getByEmail(email: string){
        return await this.userModel.findOne({ email }).exec();
    }
    
    async getByCpfCnpj(cpfcnpj: number){
        return await this.userModel.findOne({ cpfcnpj }).exec();
    }

    async getMenu(_id: string){
        const user = await  this.userModel.findOne({ _id }).populate('menu').exec();
        let subExits = [];
        for (const [index, menu] of user.menu.entries()) {
            // Verifica se o menu está inativo e o remove
            if(!menu.is_active){
                user.menu.splice(index, 1);
            } 
            // Verificar se o usuario possui ou não permissão nos submenus
            for (const submenu of menu.submenu) {
                let hasSub = user.submenu.findIndex(x => x == submenu._id);
                let findSub = menu.submenu.findIndex(x => x._id == user.submenu[hasSub]);
                if(findSub > -1){
                    if(!menu.submenu[findSub].is_active) continue;
                    else subExits.push(menu.submenu[findSub]);
                }
            }
            /* 
                Subscreve o submenu com apenas os permitidos
                e remove caso não houver nenhum
             */
            if(subExits.length > 0){
                menu.submenu = subExits;
                subExits = [];
            } else {
                menu.submenu = [];
            }
        }
        return user.menu; // Retorna o menu
    }

    async create(user) {
        const hashPassword = await bcrypt.hash(user.password, 10);
        try {
            const createUser = new this.userModel({
                ...user,
                password: hashPassword, // Troca a senha enviada para o crypt.hash
                roles: ['customer']
            });
            await createUser.save(); // Salvar o usuario no banco
            this.sMail.registerEmail(createUser.email, createUser.name); // Enviado e-mail de bem-vindo
            return new HttpException('Cadastro com sucesso!', HttpStatus.CREATED);
        } catch(error) {
            if(error.code === 11000 && error.keyPattern.email == 1){
                throw new HttpException('Este e-mail já está cadastrado!', HttpStatus.BAD_REQUEST);
            }
            if(error.code === 11000 && error.keyPattern.cpfcnpj == 1){
                throw new HttpException('Este CPF/CNPJ já está cadastrado!', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Houve um erro ao executar sua requisição, verifique os campos e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
       
    }


    async update(id: string, user: any){
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
