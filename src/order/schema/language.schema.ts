import * as mongoose from 'mongoose';

export const LanguageProgramSchema = new mongoose.Schema({
   type: {
       type: String,
       required: true
   }
});

