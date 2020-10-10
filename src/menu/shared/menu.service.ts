import { UserService } from 'src/user/shared/user.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuModel } from './menu';

@Injectable()
export class MenuService {
    constructor(
        @InjectModel('Menu') private readonly menuModel: Model<MenuModel>,
        private sUser: UserService
    ){}

    async create(data) {
        const menu = await new this.menuModel(data);
        return await menu.save();
    }

    async getAll() {
        return await this.menuModel.find().exec();
    }

    async addMenuSubMenu(_id: string, data: any){
        try {
            await this.menuModel.findOneAndUpdate({_id}, { $push: { submenu: data } });
            return await this.menuModel.findOne({_id});
        } catch (error) {
            console.log(error);
        }
    }

    async addUserMenu(_id: string, data: any){
        try {
            console.log(_id);
            await this.sUser.update(_id, { $push: { menu: { $each: data.menu } } });
            return await this.sUser.getById(_id);
        } catch (error) {
            console.log(error);
        }
    }

    async addUserSubmenu(_id: string, data: any){
        try {
            await this.sUser.update(_id, { $push: { submenu: { $each: data.submenu } } });
            return await this.sUser.getById(_id);
        } catch (error) {
            console.log(error);
        }
    }

}
