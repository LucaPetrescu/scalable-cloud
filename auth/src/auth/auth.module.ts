import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {MongooseModule} from '@nestjs/mongoose';
@Module({
  providers: [AuthService]
})
export class AuthModule {}
