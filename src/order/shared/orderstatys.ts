import { Document } from 'mongoose';

export interface OrderStatusModel extends Document {
    _id: string;
    statusid: Number;
    status: string;
    description: string;
}