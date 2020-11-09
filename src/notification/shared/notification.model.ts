import { Document } from 'mongoose';

export interface NotificationModel extends Document {
    title: string;
    description: string;
    icon: string;
    room: string | string[];
    link: string;
    time: string;
}