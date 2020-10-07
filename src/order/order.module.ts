import { OrderSchema } from './schema/order.schema';
import { OrderController } from './schema/order.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Order', schema: OrderSchema}]),
  ],
  controllers: [
        OrderController, 
  ],
  providers: [],
})
export class OrderModule {}
