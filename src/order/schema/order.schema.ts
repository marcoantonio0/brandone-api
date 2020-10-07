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
    category: [],
    status: [],
    create_at: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
})