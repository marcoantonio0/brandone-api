import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderModel } from './order';

@Injectable()
export class OrderService {
    constructor(@InjectModel('Order') private readonly orderModel: Model<OrderModel>) {}

    async getAll(): Promise<any>{
       this.orderModel.find().exec();
    }
    
}
