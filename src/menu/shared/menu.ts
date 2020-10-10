import { Document } from 'mongoose';

export interface MenuModel extends Document {
    description: string;
    link: string;
    is_active: Boolean;
}