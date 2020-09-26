import { Document } from 'mongoose';

export interface UserModel extends Document {
    username: string;
    password: string;
    name: string;
    birthday: Date;
    cpfCnpj: Number;
    roles: string[];
}