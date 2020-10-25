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
    commission: {
        type: Number,
        default: 0
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
   time: {
       type: String,
       required: true,
       default: 0
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
    price_nocommission: {
        type: Number,
        default: 0
    },
    price_gain: {
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
    language_program: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LanguageProgram'
    }]
}, { timestamps: true })

OrderSchema.index({ title: "text" });
