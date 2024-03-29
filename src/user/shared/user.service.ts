import { TokenService } from './../../token/shared/token.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user';
import { query } from 'express';
import { MailService } from 'src/mailer/mail.service';
import { UserCategoryModel } from './usercategory';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserModel>,
        @InjectModel('UserCategory') private readonly userCategoryModel: Model<UserCategoryModel>,
        private sToken: TokenService,
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
        const select = 'email name menu submenu cpfcnpj roles birthday createdAt updatedAt hour_price hour_worked';
        return await this.userModel.findOne({ _id: id }).populate('menu').select(select).exec();
    }

    async getByEmail(email: string){
        return await this.userModel.findOne({ email }).exec();
    }
    
    async getByCpfCnpj(cpfcnpj: number){
        return await this.userModel.findOne({ cpfcnpj }).exec();
    }

    async getMenu(_id: string){
        try {
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
        
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição, verifique os campos e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    async setTokenPassword(username){
        let user;
        if(isNaN(username)){
            user = await this.getByEmail(username);
        } else {
            user = await this.getByCpfCnpj(Number.parseInt(username));
        }
        if(!user){
            throw new HttpException('E-mail ou CPF/CNPJ inválido.', HttpStatus.NOT_FOUND);
        }
        const tokens = await this.sToken.getAllTokenById(user._id);
        if(tokens.length != 0 && tokens.length >= 1) {
            throw new HttpException('Você já tem uma solicitação de alteração de senha ativa. Verifique seu e-mail ou tente novamente mais tarde.', HttpStatus.BAD_REQUEST);
        }
        const token = await this.sToken.create({
            type: 'passwordReset',
            id: user._id
        });
        return new HttpException(`Solicitação feita com sucesso! Enviamos um e-mail para "${this.protect_email(user.email)}" com instruções para criar uma nova senha.`, HttpStatus.CREATED);
    }

    async changePassword(data){
        const getToken = await this.sToken.getToken(data.token);
        if(!getToken){
            throw new HttpException('Token inválido ou expirado.', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(data.password, 10);
        try {
            await this.userModel.updateOne({ _id: getToken.id }, { password: hashPassword }).exec();
            await this.sToken.expireToken(getToken._id);
            return new HttpException('Senha atualizada com sucesso!', HttpStatus.OK);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTokenPassword(token){
        const getToken = await this.sToken.getToken(token);
        if(!getToken){
            throw new HttpException('Token inválido ou expirado.', HttpStatus.BAD_REQUEST);
        }
        return new HttpException('Token válido.', HttpStatus.OK)
    }

    async setOffline(_id: string){
        await this.userModel.updateOne({ _id }, { online: false }).exec();
    }

    async setOnline(_id: string){
        await this.userModel.updateOne({ _id }, { online: true }).exec();
        return await this.userModel.findOne({_id}).exec();
    }

    async delete(id: string){
        try {
            return await this.userModel.deleteOne({ _id: id }).exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createCategoryUser(data: UserCategoryModel){
        try {
            const category = new this.userCategoryModel(data);
            await category.save();
            return new HttpException('Categoria criada com sucesso!', HttpStatus.CREATED);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllUsers(){
        try {
            return await this.userModel.find({ roles: { $in: ['user'] }}).populate('category_user').select('name hour_price category_user').exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    protect_email(user_email: string) {
        var avg, splitted, part1, part2;
        splitted = user_email.split("@");
        part1 = splitted[0];
        avg = part1.length / 2;
        part1 = part1.substring(0, (part1.length - avg));
        part2 = splitted[1];
        return part1 + "...@" + part2;
    }

}
