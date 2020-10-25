import { Document } from 'mongoose';

export interface UserCategoryModel extends Document {
    type: string;
}