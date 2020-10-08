import { OrderController } from './order.controller';
import { OrderService } from './shared/order.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    UserModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
