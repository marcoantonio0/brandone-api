import { CategoryController } from './shared/category.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './shared/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}]),
  ],
  controllers: [CategoryController],
  providers: [],
})
export class CategoryModule {}
