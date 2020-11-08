import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    cpfcnpj: {
        type: String,
        unique: true,
        trim: true,
        maxlength: 16,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        maxlength: 320,
        required: true
    },
    password: {
        type: String,
        trim: true,
        maxlength: 128,
        required: true
    },
    name: {
        type: String,
        maxlength: 128,
        required: true
    },
    picture: {
        type: String
    },
    birthday: {
        type: Date,
        required: true
    },
    roles: [{
        type: String,
        enum: ['admin', 'user', 'customer'],
        required: true
    }],
    razao_social: {
        type: String,
        maxlength: 128 
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    menu: [{
        type: mongoose.Types.ObjectId,
        ref: 'Menu'
    }],
    submenu: [{
        type: String
    }],
    hour_price: {
        type: String,
        default: 0
    },
    hour_worked: {
        type: String,
        default: 0
    },
    category_user: {
        type: mongoose.Types.ObjectId,
        ref: 'UserCategory'
    }
}, { timestamps: true });

UserSchema.index({ name: "text", cpfcnpj: "text", email: "text", roles: "text" });
