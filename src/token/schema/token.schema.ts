import { TokenModel } from './../shared/token.model';
import * as mongoose from 'mongoose';
import { O_NOFOLLOW } from 'constants';

export const TokenSchema = new mongoose.Schema({
    token: {
     type: String,
     required: true,
     unique: true   
    },
    type: {
        type: String,
        enum: ['passwordReset', 'checkout'],
        required: true
    },
    id: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expireAt: {
        type: Date,
        default: ''
    },
    expired: {
        type: Boolean,
        default: false
    }
});

TokenSchema.pre<TokenModel>('save',  function(next) {
    if(this.type === 'checkout'){
        const date = new Date();
        date.setTime(date.getTime()+(30*24*60*60*1000));
        this.expireAt = date.toString();
    }

    if(this.type === 'passwordReset'){
        const date = new Date();
        date.setTime(date.getTime()+(2*60*60*1000));
        this.expireAt = date.toString();
    }
    
    next();
})