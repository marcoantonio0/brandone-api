import { Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 128,
        required: true,
    },
    description: {
        type: String,
        maxlength: 600,
        required: true
    },
    images: [{
        type: String
    }],
    category: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true
    }],
    status: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Status',
        required: true
    }],
    create_at: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true })