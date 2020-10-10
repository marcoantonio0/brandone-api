import { Document } from 'mongoose';

export interface OrderModel extends Document {
    user: string; 
   title: string;
   description: string;
   create_at: Date;
   category: string[];
   deadline: string;
   images: string[];
   status: string[];
}