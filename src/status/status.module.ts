import { StatusController } from './shared/status.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Status', schema: StatusModule}])
  ],
  controllers: [StatusController],
  providers: [],
})
export class StatusModule {}
