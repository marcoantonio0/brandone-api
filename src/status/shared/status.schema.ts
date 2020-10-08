import { Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
    description: {
        type: String
    }    
}, { timestamps: true })