import { JwtAuthGuard } from './../auth/shared/jwt-auth.guard';
import { UserService } from './shared/user.service';
import { Body, Controller, Delete, Get, Param, Post, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { UserModule } from './user.module';
import { UserModel } from './shared/user';
import { RolesGuard } from 'src/auth/shared/roles.guard';

@Controller('user')
export class UserController {

    constructor(
        private sUser: UserService
    ){}
    
    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAll(): Promise<UserModel[]>{
        return this.sUser.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) : Promise<UserModule>{
        return this.sUser.getById(id);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('email/:id')
    async getByEmail(@Param('email') email: string) : Promise<UserModule>{
        return this.sUser.getByEmail(email);
    }

    @Post()
    async create(@Body() user: UserModel) : Promise<UserModel>{
        return this.sUser.create(user);
    }

    @SetMetadata('roles', ['custumer','user'])
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
}
