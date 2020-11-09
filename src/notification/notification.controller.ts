import { NotificationService } from './shared/notification.service';
import { Body, Controller, Get, Post, SetMetadata, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';
import { RolesGuard } from 'src/auth/shared/roles.guard';
import { NotificationModel } from './shared/notification.model';

@Controller('notification')
export class NotificationController {
    constructor(
        private sNotification: NotificationService
    ){ }

    @SetMetadata('roles', ['user','customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() data: NotificationModel) {
        return this.sNotification.create(data);
    }

    @SetMetadata('roles', ['user','customer','admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async getNotification(@Param('id') _id: string) {
        return this.sNotification.getNotification(_id);
    }

}
