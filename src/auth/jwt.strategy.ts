import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

const extractFromCookieOrHeader = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['weddingos_token'];
    }
    return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: extractFromCookieOrHeader,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-wedding-os-key-change-in-prod',
        });
    }

    async validate(payload: { sub: string; email: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub }
        });

        if (!user) {
            throw new UnauthorizedException('Token inválido ou usuário não existe');
        }

        return { id: payload.sub, email: payload.email };
    }
}
