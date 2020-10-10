import { OrderStatusModel } from './orderstatys';
import { OrderModel } from './order';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<OrderModel>,
        @InjectModel('OrderStatus') private readonly orderStatusModel: Model<OrderStatusModel>
    ) {}

    async create(data: OrderModel) {
        try {
            let orderStatus = await this.orderStatusModel.findOne({ idstatus: 1 }).exec();
            data.status = [orderStatus._id];
            const order = await new this.orderModel(data);
            await order.save();
            return new HttpException('Briefing criado com sucesso!', HttpStatus.CREATED);
        } catch (error) {
            console.log(error);
            return new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
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
            console.log(error);
            return new HttpException('Houve um erro ao executar sua requisição. Verifique os dados enviados e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
