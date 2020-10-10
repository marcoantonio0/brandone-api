import { CategoryModel } from './category';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(@InjectModel('Category') private readonly categoryModel: Model<CategoryModel>){}

    async create(data: CategoryModel) {
        try {
            const category = await new this.categoryModel(data);
            await category.save();
            return new HttpException('Criado com sucesso!', HttpStatus.CREATED);
        } catch (error) {
            throw new HttpException('Houve um erro ao executar sua requisição, verifique os campos e tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAll() {
        return this.categoryModel.find().exec();
    }

}
