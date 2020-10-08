import { JwtAuthGuard } from './../auth/shared/jwt-auth.guard';
import { CategoryService } from './shared/category.service';
import { Body, Controller, HttpException, HttpStatus, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/shared/roles.guard';
import { CategoryModel } from './shared/category';

@Controller('category')
export class CategoryController {
    constructor(
        private sCategory: CategoryService
    ) {}


    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: CategoryModel) : Promise<any> {
        return this.sCategory.create(data);
    }
}
