import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Authorization token missing');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });

            // Attach payload to request for route handlers
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers['authorization'];
        if (!authHeader) return undefined;

        const [type, token] = authHeader.trim().split(/\s+/);
        return type.toLowerCase() === 'bearer' ? token : undefined;
    }
}
