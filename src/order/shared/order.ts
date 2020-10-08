import { Document } from 'mongoose';

export interface OrderModel extends Document {
    user: Object;
    title: string;
    description: string;
    images: string[];
    category: Object[];
    status: Object[];
    create_at: string,
    timestamp: string
}