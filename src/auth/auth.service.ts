import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }
    async register(registerDto: RegisterDto) {
        /*
        * 1. Check email is already exists
        * 2. Hash password
        * 3. Create new user
        * 4. Generate JWT token
        * 5. Return token and user
        */


        // 1. Check email is already exists
        const user = await this.userService.getUserByEmail(registerDto.email);
        if (user) {
            throw new ConflictException('Email already exists');
        }

    }
}
