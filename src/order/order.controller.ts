import { OrderService } from './shared/order.service';
import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';
import { RolesGuard } from 'src/auth/shared/roles.guard';

@Controller()
export class OrderController {
    constructor(
        private sOrder: OrderService
    ){}

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAll(): Promise<any>{
        return this.sOrder.getAll();
    }

}
