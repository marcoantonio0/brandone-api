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
import { LanguageSchema } from './schema/language.schema';

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
    MongooseModule.forFeature(
      [{ name: 'OrderStatus', schema: OrderStatusSchema }, { name: 'Language', schema: LanguageSchema }, { name: 'Archive', schema: LanguageSchema }],
      ),
    UserModule,
    MailModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
