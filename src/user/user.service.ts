import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService) { } // Inject PrismaService

    async getUserByEmail(email: string) { // Find user by email
        try {
            return await this.prismaService.user.findUnique({
                where: { email },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch user');
        }
    }
    async createUser(userDto: RegisterDto) { // Create a new user
        try {
            const user = await this.prismaService.user.create({
                data: userDto,
            });
            // remove password before returning
            const { password, ...safeUser } = user;
            return safeUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new InternalServerErrorException('Failed to create user');
        }
    }
}
