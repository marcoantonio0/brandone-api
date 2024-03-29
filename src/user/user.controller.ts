import { JwtAuthGuard } from './../auth/shared/jwt-auth.guard';
import { UserService } from './shared/user.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { UserModule } from './user.module';
import { UserModel } from './shared/user';
import { RolesGuard } from 'src/auth/shared/roles.guard';
import { MenuModel } from 'src/menu/shared/menu';
import { MenuModule } from 'src/menu/menu.module';
import { UserCategoryModel } from './shared/usercategory';

@Controller('user')
export class UserController {

    constructor(
        private sUser: UserService
    ){}
    
    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAll(@Query() query: string): Promise<any>{
        return this.sUser.getAll(query);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('id/:id')
    async getById(@Param('id') id: string) : Promise<UserModule>{
        return this.sUser.getById(id);
    }

    @Get('cpfcnpj/:id')
    async getByCpfCnpj(@Param('id') cpfCnpj: number) : Promise<UserModule>{
        return this.sUser.getByCpfCnpj(cpfCnpj);
    }

    @Get('email/:id')
    async getByEmail(@Param('id') email: string) : Promise<UserModule>{
        return this.sUser.getByEmail(email);
    }

    @Post('password')
    async recoverPassword(@Body() data: any) : Promise<any>{
        return this.sUser.setTokenPassword(data.username);
    }

    @Get('password/:token')
    async getTokenPassword(@Param('token') token: string) : Promise<any>{
        return this.sUser.getTokenPassword(token);
    }

    @Post('password/change')
    async changePassword(@Body() data: any) : Promise<any>{
        return this.sUser.changePassword(data);
    }

    @Post()
    async create(@Body() user: UserModel) : Promise<any>{
        return this.sUser.create(user);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() user: UserModel
        ) : Promise<UserModel>{
        return this.sUser.update(id, user);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @Delete(':id')
    async delete(@Param('id') id: string){
        return this.sUser.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('menu/:id')
    getMenu(@Param('id') _id: string): Promise<MenuModule[]>{
        return this.sUser.getMenu(_id);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('freelancer')
    getAllUser(): Promise<MenuModule[]>{
        return this.sUser.getAllUsers();
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('category')
    createCategory(@Body() data: UserCategoryModel) {
        return this.sUser.createCategoryUser(data);
    }

}
