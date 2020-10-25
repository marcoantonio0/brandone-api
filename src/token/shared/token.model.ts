import { Document } from 'mongoose';

export interface TokenModel extends Document {
    token: string;
    type: string;
    id: string;
    expireAt: string;
    expired: boolean;
    createdAt: Date;
}