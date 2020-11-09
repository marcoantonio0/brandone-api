import { UserCategorySchema } from './schema/usercategory.schema';
import { UserSchema } from './schema/user.schema';
import { UserService } from './shared/user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mailer/mail.module';
import { TokenModule } from 'src/token/token.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}, {name: 'UserCategory', schema: UserCategorySchema}]),
        MailModule,
        TokenModule
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService
    ],
    exports: [UserService]
})
export class UserModule {}
