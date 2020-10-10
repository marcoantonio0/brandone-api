
import { OrderService } from './shared/order.service';
import { OrderModel } from './shared/order';
import { Body, Controller, Post } from '@nestjs/common';
import { OrderStatusModel } from './shared/orderstatys';

@Controller('order')
export class OrderController {
    constructor(
        private sOrder: OrderService
    ){}
    @Post()
    async create(@Body() data: OrderModel) {
        return this.sOrder.create(data);
    }

    @Post('status')
    async createStatus(@Body() data: OrderStatusModel[]) {
        return this.sOrder.createStatus(data);
    }
}
