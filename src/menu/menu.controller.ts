import { MenuService } from './shared/menu.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MenuModel } from './shared/menu';

@Controller('menu')
export class MenuController {
    constructor(
        private sMenu: MenuService
        ) {}

    @Post()
    async create(@Body() data: MenuModel) : Promise<any>{
        return this.sMenu.create(data);
    }

    @Get()
    async getAll() : Promise<MenuModel[]>{
        return this.sMenu.getAll();
    }

    @Post('user/:id')
    async addUserMenu(@Param('id') _id: string, @Body() data: string[]): Promise<any>{
        return this.sMenu.addUserMenu(_id, data);
    }

    @Post('user/submenu/:id')
    async addUserSubmenu(@Param('id') _id: string, @Body() data: string[]): Promise<any>{
        return this.sMenu.addUserSubmenu(_id, data);
    }
    @Post('submenu/:id')
    async addMenuSubMenu(@Param('id') _id: string, @Body() data: string[]): Promise<any>{
        return this.sMenu.addMenuSubMenu(_id, data);
    }


}
