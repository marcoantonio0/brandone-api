import { UserService } from 'src/user/shared/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
            const user = await this.sUser.getById(_id);
            if(user.menu.findIndex(x => x._id == data.menu) > -1){
                await this.sUser.update(_id, { $pull: { menu: data.menu  } });
            } else {
                await this.sUser.update(_id, { $push: { menu:  data.menu } });
            }
            return await this.sUser.getById(_id);
        } catch (error) {
            throw new HttpException('Houve um erro a executar sua requisição.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addUserSubmenu(_id: string, data: any){
        try {
            const user = await this.sUser.getById(_id);
            if(user.submenu.findIndex(x => x == data.submenu) > -1){
                await this.sUser.update(_id, { $pull: { submenu: data.submenu  } });
            } else {
                await this.sUser.update(_id, { $push: { submenu:  data.submenu } });
            }
            return await this.sUser.getById(_id);
        } catch (error) {
            throw new HttpException('Houve um erro a executar sua requisição.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
