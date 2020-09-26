import { UserSchema } from './schema/user.schema';
import { UserService } from './shared/user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
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
