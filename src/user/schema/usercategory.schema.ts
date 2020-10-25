import * as mongoose from 'mongoose';

export const UserCategorySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    }
});
