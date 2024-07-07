import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) 
  private userModel: Model<User>,
  private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<{token: string}>{
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if(!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password)

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign({id: user.id}) 

      return {token}

    } catch(e) {
      throw new Error(e.message);
    }
  }

  async register(registerDto: RegisterDto): Promise<{token: string}>{
    try{
      const {lastName, firstName, email, password} = registerDto;

      const user = await this.userModel.findOne({email});

      if(user){
        throw new UnauthorizedException('User with this email already exists!')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const createdUser = await this.userModel.create({
        lastName,
        firstName,
        email,
        password: hashedPassword,
      })

      const token = this.jwtService.sign({id: createdUser.id})

      return {token}

    }catch(e){
      throw new Error(e.message)
    }
  }

}
