import { MailerService } from '@nestjs-modules/mailer';
import { OrderStatusModel } from './orderstatys';
import { OrderModel } from './order';
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
        private readonly sMail: MailService
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
        let populate = 'category status';
        try {
           return await this.orderModel.findOne({ _id }).populate(populate).exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
