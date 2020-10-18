import * as mongoose from 'mongoose';

export const ArchiveSchema = new mongoose.Schema({
   type: {
       type: String,
       required: true
   },
   initials: {
       type: String,
       required: true
   },
   icon: {
    type: String
   }
});

