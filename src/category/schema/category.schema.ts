import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
   description: {
       type: String,
       maxlength: 128,
       required: true
   },
   abreviation: {
       type: String,
       maxlength: 48
   }
})