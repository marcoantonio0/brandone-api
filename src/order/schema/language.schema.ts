import * as mongoose from 'mongoose';

export const LanguageSchema = new mongoose.Schema({
   type: {
       type: String,
       required: true
   }
});

