import * as mongoose from 'mongoose';

export const OrderStatusSchema = new mongoose.Schema({
    idstatus: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})