import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    // We define the payload then sign accordinglt 
    private async signToken(userId: number, email: string, role: string) {

        const payload = { sub: userId, email, role};
        const token = await this.jwtService.signAsync(payload);

        return { access_token: token};
    }   

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {email: dto.email}
        });

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(dto.password,10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
            },

        });

        return this.signToken(user.id, user.email, user.role);
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({

            where: { email: dto.email}
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatches = await bcrypt.compare(dto.password, user.password);

        if (!passwordMatches) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        return this.signToken(user.id, user.email, user.role);

    }
}
