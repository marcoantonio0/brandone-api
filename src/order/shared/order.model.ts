import { Document } from 'mongoose';

export interface OrderModel extends Document {
    user: any; 
    customer: any;
   title: string;
   description: string;
   createAt: Date;
   updatedAt: Date;
   category: string[];
   deadline: Date;
   images: string[];
   status: string[];
   _id: string;
}