import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    icon: {
        type: String
    },
    room: {
        type: String
    },
    link: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now()
    }
});