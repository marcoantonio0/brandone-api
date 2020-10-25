import { TokenService } from './../../token/shared/token.service';
import { UserService } from 'src/user/shared/user.service';
import { LanguageModel } from './language.model';
import { ArchiveModel } from './archive.model';
import { MailerService } from '@nestjs-modules/mailer';
import { OrderStatusModel } from './orderstatus.model';
import { OrderModel } from './order.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as SibApiV3Sdk from 'sib-api-v3-sdk'; // add this 1 of 4
import { MailService } from 'src/mailer/mail.service';



@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<OrderModel>,
        @InjectModel('OrderStatus') private readonly orderStatusModel: Model<OrderStatusModel>,
        @InjectModel('Archive') private readonly archiveModel: Model<ArchiveModel>,
        @InjectModel('LanguageProgram') private readonly languageModel: Model<LanguageModel>,
        private sUser: UserService,
        private readonly sMail: MailService,
        private sToken: TokenService
    ) {}

    async create(data: OrderModel) {
        try {
            let orderStatus = await this.orderStatusModel.findOne({ idstatus: 1 }).exec();
            data.status = [orderStatus._id];
            const order = await new this.orderModel(data);
            await order.save();
            return new HttpException('Briefing criado com sucesso!', HttpStatus.CREATED);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    async getAll() {
        let removePopulate= '-password -cpfcnpj -menu -submenu -email -birthday -roles -phone -updatedAt -createdAt -razao_social';
        let populate = 'category status user customer';
        try {   
           return await this.orderModel.find().populate(populate, removePopulate).exec();
        } catch (error) {
            console.log(error);
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOrdersByUserId(_id: string, querys){
        try {   
            let populate = 'category status';
            let order;
            let count;
            let query = { user: _id };
            const offset =  parseInt(querys.offset) || 0;
            if(Object.keys(querys).length != 0){
                if(querys.search) query['$text'] = { $search: querys.search };  
                count = await this.orderModel.find(query).populate('menu').countDocuments();
                order = await this.orderModel.find(query).populate('menu').populate(populate).skip(offset).limit(15).exec();
            } else {
                count =  await this.orderModel.find(query).populate('menu').countDocuments();
                order = await this.orderModel.find(query).populate('menu').populate(populate).skip(offset).limit(15).exec();
            }
            let orderAll = {};
            orderAll['total'] = count;
            orderAll['orders'] = order;
            return orderAll;
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createStatus(data: OrderStatusModel[]) {
        try {
            for (const status of data) {
                const order = await new this.orderStatusModel(status);
                await order.save();
            }
            return new HttpException('Status criado com sucesso!', HttpStatus.CREATED);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOrderById(_id: string){
        let removePopulate= '-password -menu -submenu -birthday -roles -updatedAt -createdAt';
        let populate = 'category archive language_program status customer user';
        try {
           return await this.orderModel.findOne({ _id }).populate(populate, removePopulate).exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createArchive(data: ArchiveModel) {
        try {
            const archive = await new this.archiveModel(data);
            await archive.save();
            return new HttpException('Archive criado com sucesso!', HttpStatus.CREATED);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    async createLanguage(data: LanguageModel) {
        try {
            const language = await new this.languageModel(data);
            await language.save();
            return new HttpException('Language criado com sucesso!', HttpStatus.CREATED);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    async getAllArchive() {
        try {
            return await this.archiveModel.find().exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    async getAllLanguage() {
        try {
            return await this.languageModel.find().exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(_id: string, data: OrderModel) {
        try {
            await this.orderModel.updateOne({ _id }, data).exec();
            return new HttpException('Order atualizado com sucesso!', HttpStatus.OK);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStatus(_id: string, data){
        try {
            await this.orderModel.updateOne({ _id }, { status: data }).exec();
            return new HttpException('Order atualizado com sucesso!', HttpStatus.OK);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllStatus(){
        try {
            return await this.orderStatusModel.find().exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPriceOrder(id, query){
        try {
            if(Object.keys(query).length > 0){
                const order = await this.orderModel.findOne({ id }).exec();
                const user = await this.sUser.getById(query.id);
                const userHourPrice = parseFloat(user.hour_price);
                const userHourDayWorked = parseFloat(user.hour_worked);
                const price = (userHourPrice * userHourDayWorked) * parseInt(order.time);
                const priceNoCommission = price - ((query.commission / 100) * price);
                return {
                    price: price,
                    price_nocommission: priceNoCommission,
                    price_gain: price - priceNoCommission
                }
            } else {
                throw new HttpException('Insira as query necessárias (commission, user id).', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            console.log(error);
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    async setBudget(id, data){
        try {
            const status = await this.orderStatusModel.findOne({ idstatus: 2 }).exec();
            await this.orderModel.updateOne({ id }, { 
                user: data.user, 
                price: data.price, 
                price_nocommission: data.price_nocommission, 
                price_gain: data.price_gain,
                $push: { status: status._id } 
            });
            const order = await this.orderModel.findOne({ id }).populate('user customer category').exec();
            const token = await this.sToken.create({
                type: 'checkout',
                id: id
            });
            order['token'] = token.token;
            await this.sMail.budgetEmail(order.customer.email, order);
            return new HttpException('Budget feito com sucesso!', HttpStatus.OK);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCheckout(token){
        const getToken = await this.sToken.getToken(token);
        if(!getToken){
            throw new HttpException('Token inválido ou expirado.', HttpStatus.BAD_REQUEST);
        }
        return await this.orderModel.findOne({ id: getToken.id }).exec();
    }

}
