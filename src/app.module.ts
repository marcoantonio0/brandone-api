import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from './mailer/mail.module';
import { MailService } from './mailer/mail.service';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';  
import { AuthModule } from './auth/auth.module';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
        MailModule, 
    MailerModule.forRoot({
      transport: {
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: "marcoantoniosouza63@gmail.com",
          pass: "FJUXNW07SQwy5sfD",
        },
      },
      defaults: {
        from:'"nest-modules" <marcoantoniosouza63@gmail.com>',
      },
      template: {
        dir: process.cwd() + '/templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
    MenuModule, 
    OrderModule, 
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.CONNECTIONSTRING, {
      useCreateIndex: true,
      useNewUrlParser: true,
    }),
    CategoryModule, 
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
        MailService, AppService],
})
export class AppModule {}
