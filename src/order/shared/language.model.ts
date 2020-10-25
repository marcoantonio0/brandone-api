import { Document } from 'mongoose';

export interface LanguageModel extends Document {
    type: string;
    _id: string;
}