import { Document } from 'mongoose';

export interface UserModel extends Document {
    submenu: string[];
    email: string;
    password: string;
    name: string;
    birthday: Date;
    cpfCnpj: Number;
    roles: string[];
    menu: [{
        _id: string;
        description: string;
        is_active: boolean;
        link: string;
        submenu: any[]
    }];
}