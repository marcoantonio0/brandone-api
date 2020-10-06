import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    cpfcnpj: {
        type: Number,
        unique: true,
        trim: true,
        maxlength: 320,
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
    birthday: {
        type: Date,
        required: true
    },
    roles: [{
        type: String,
        enum: ['admin', 'user', 'customer'],
        required: true
    }],
    phone: {
        type: Number,
        required: true,
        trim: true
    }
})