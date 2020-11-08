import * as mongoose from 'mongoose';

export const BidSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    orderid: {
        type: String,
        required: true
    },
   description: {
       type: String,
       maxlength: 250,
       required: true
   },
    price: {
        type: Number,
        default: 0
    },
    dateApplicated: {
        type: Date,
        default: Date.now()
    }
});
