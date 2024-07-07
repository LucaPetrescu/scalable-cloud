import {Body, Controller, Get, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto} from './dto/login.dto'
import {RegisterDto} from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/register')
    register(@Body() registerDto: RegisterDto): Promise<{token: string}>{
        return this.authService.register(registerDto);
    }

    @Get('/login')
    login(@Body() loginDto: LoginDto): Promise<{token: string}>{
        return this.authService.login(loginDto);
    }
    
}