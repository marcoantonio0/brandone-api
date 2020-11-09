import { MenuModule } from './../menu/menu.module';
import { UserModule } from './../user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationSchema } from './schema/notification.schema';
import { NotificationService } from './shared/notification.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        UserModule,
        MenuModule,
        MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
    ],
    controllers: [
        NotificationController, ],
    providers: [
        NotificationService, ],
        exports: [NotificationService]
})
export class NotificationModule {}
