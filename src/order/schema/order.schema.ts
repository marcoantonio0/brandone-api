import { OrderModel } from './../shared/order.model';
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
    }],
    auction_status: {
        type: Number,
        enum: [0, 1],
        required: true,
        default: 0
    },
    bids: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true 
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            maxlength: 250
        },
        dateApplicated: {
            type: Date,
            defualt: Date.now()
        }
    }],
    action_deadline: {
        type: Date
    }
}, { timestamps: true });

OrderSchema.pre<OrderModel>('save', function(next) {
    const date = new Date();
    date.setTime(date.getTime()+(4*24*60*60*1000));
    this.action_deadline = date;
    next();
});

OrderSchema.index({ title: "text" });
