import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    async register(registerDto: RegisterDto) {
        try {
            // 1. Check if email already exists
            const existingUser = await this.userService.getUserByEmail(registerDto.email);
            if (existingUser) {
                throw new ConflictException('Email already exists');
            }

            // 2. Hash password using bcrypt
            const saltRounds = jwtConstants.saltRounds;
            const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

            // 3. Create new user (store hashed password)
            const newUser = await this.userService.createUser({ ...registerDto, password: hashedPassword });

            // 5. Log successful registration
            this.logger.log(`User registered successfully: ${newUser.id} with email: ${newUser.email}`);

            // 4. Generate JWT token
            const payload = { sub: newUser.id, email: newUser.email };
            const token = await this.jwtService.signAsync(payload, { secret: jwtConstants.secret });

            // 6. Return token + user
            return {
                access_token: token,
            };
        } catch (error) {
            console.error('AuthService register error:', error);
            throw new InternalServerErrorException('Registration failed');
        }
    }

    // login
    async login(loginDto: LoginDto) {
        try {
            // 1. Check if email exists
            const user = await this.userService.getUserByEmail(loginDto.email);
            if (!user) {
                throw new UnauthorizedException('Email or password is incorrect!');
            }

            // 2. Compare password
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Email or password is incorrect!');
            }
            // 3. Log successful login
            this.logger.log(`User logged in successfully: ${user.id} with email: ${user.email}`);

            // 4. Generate JWT token
            const payload = { sub: user.id, email: user.email };
            const token = await this.jwtService.signAsync(payload, { secret: jwtConstants.secret });

            // const { password, ...safeUser } = user;

            // 5. Return token + user
            return {
                access_token: token,
            };
        } catch (error) {
            console.error('AuthService login error:', error);
            throw new InternalServerErrorException('Login failed');
        }
    }

}
