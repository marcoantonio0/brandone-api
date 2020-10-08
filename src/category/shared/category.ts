import { Document } from 'mongoose';

export interface CategoryModel extends Document {
    description: string;
    abreviation: string;
}