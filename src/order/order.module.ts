import { TokenModule } from './../token/token.module';
import { OrderController } from './order.controller';
import { OrderService } from './shared/order.service';
import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { UserModule } from 'src/user/user.module';
import { OrderStatusSchema } from './schema/orderstatus.schema';
import { MailModule } from 'src/mailer/mail.module';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { ArchiveSchema } from './schema/archive.schema';
import { LanguageProgramSchema } from './schema/language.schema';
import { BidSchema } from './schema/bid.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Order',
        useFactory: async (connection: Connection) => {
          const schema = OrderSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {inc_field: 'id'});
          return schema;
        },
        inject: [getConnectionToken(process.env.CONNECTIONSTRING)],
      },
    ]),
    MongooseModule.forFeature([
      { name: 'OrderStatus', schema: OrderStatusSchema }, 
      { name: 'LanguageProgram', schema: LanguageProgramSchema }, 
      { name: 'Archive', schema: ArchiveSchema },
      { name: 'Bid', schema: BidSchema }
    ]),
    UserModule,
    MailModule,
    TokenModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
