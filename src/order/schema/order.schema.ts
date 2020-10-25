import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
   title: {
       type: String,
       maxlength: 128,
       required: true
   },
   description: {
       type: String,
       maxlength: 600,
       required: true
   },
   category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true   
   }],
   deadline: {
       type: Date,
       required: true
   },
   images: [{
       type: String
   }],
   status: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderStatus',
    required: true  
    }],
    price: {
        type: Number,
        default: 0
    },
    itens: [{
        type: String,
    }],
    updates: [{
        title: {
            type: String,
            maxlength: 128, 
            required: true
        },
        description: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    archive: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Archive' 
    }],
    language: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    }]
}, { timestamps: true })

OrderSchema.index({ title: "text" });
