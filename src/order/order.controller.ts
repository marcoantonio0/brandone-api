import { LanguageModel } from './shared/language.model';
import { ArchiveModel } from './shared/archive.model';

import { OrderService } from './shared/order.service';
import { OrderModel } from './shared/order.model';
import { Body, Controller, Get, Param, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { OrderStatusModel } from './shared/orderstatus.model';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';
import { RolesGuard } from 'src/auth/shared/roles.guard';

@Controller('order')
export class OrderController {
    constructor(
        private sOrder: OrderService
    ){}
    
    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAll() {
        return this.sOrder.getAll();
    }

    @SetMetadata('roles', ['customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('language')
    async getAllLanguage() {
        return this.sOrder.getAllLanguage();
    }

    @SetMetadata('roles', ['customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('archive')
    async getAllArchive() {
        return this.sOrder.getAllArchive();
    }

    @SetMetadata('roles', ['customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() data: OrderModel) {
        return this.sOrder.create(data);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('status')
    async createStatus(@Body() data: OrderStatusModel[]) {
        return this.sOrder.createStatus(data);
    }

    @SetMetadata('roles', ['customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('user/:id')
    async getOrdersByUserId(@Param('id') _id: string, @Query() query) {
        return this.sOrder.getOrdersByUserId(_id, query);
    }

    @SetMetadata('roles', ['customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async getOrderById(@Param('id') _id: string) {
        return this.sOrder.getOrderById(_id);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('archive')
    async createArchive(@Body() data: ArchiveModel) {
        return this.sOrder.createArchive(data);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('language')
    async createLanguage(@Body() data: LanguageModel) {
        return this.sOrder.createLanguage(data);
    }
}
