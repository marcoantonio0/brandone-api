import { Document } from 'mongoose';

export interface OrderStatusModel extends Document {
    _id: string;
    idstatus: Number;
    status: string;
    description: string;
    user: string;
}