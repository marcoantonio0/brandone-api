import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationModel } from './notification.model';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel('Notification') private readonly notificationModel: Model<NotificationModel>
    ) { }

    async create(data: NotificationModel){
        try {
            const notification = await new this.notificationModel(data);
            notification.save();
            return new HttpException('Notificação criada com sucesso.', HttpStatus.CREATED);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getNotification(_id: string){
        try {
           return await this.notificationModel.find({ room: ['global',_id, 'user_notification'] }).exec();
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

}
