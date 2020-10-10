import { UserModule } from 'src/user/user.module';
import { MenuSchema } from './schema/menu.schema';
import { MenuService } from './shared/menu.service';
import { MenuController } from './menu.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Menu', schema: MenuSchema }]),
        UserModule
    ],
    controllers: [
        MenuController, ],
    providers: [
        MenuService, ],
})
export class MenuModule {}
