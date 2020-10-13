import * as mongoose from 'mongoose';

export const MenuSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true,
        required: true
    },
    icon: {
        type: String,
    },
    submenu: [{
        description: {
            type:String,
            required: true,
        },
        link: {
            type: String,
            required: true
        },
        is_active: {
            type: Boolean,
            default: true,
            required: true
        }
    }]
})