
import { OrderService } from './shared/order.service';
import { OrderModel } from './shared/order';
import { Body, Controller, Get, Param, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { OrderStatusModel } from './shared/orderstatys';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';
import { RolesGuard } from 'src/auth/shared/roles.guard';

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

    @SetMetadata('roles', ['customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('user/:id')
    @Post('status')
    async getOrdersByUserId(@Param('id') _id: string, @Query() query) {
        return this.sOrder.getOrdersByUserId(_id, query);
    }

    @SetMetadata('roles', ['customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    @Post('status')
    async getOrderById(@Param('id') _id: string) {
        return this.sOrder.getOrderById(_id);
    }
}
