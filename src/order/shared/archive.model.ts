import { Document } from 'mongoose';

export interface ArchiveModel extends Document {
    type: string;
    initials: string;
    icon: string;
    _id: string;
}