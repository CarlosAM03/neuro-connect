import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { safeUserSelect } from '../users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });
    try {
      return await this.prisma.user.create({
        data: { email: dto.email, displayName: dto.displayName, passwordHash },
        select: safeUserSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException('El correo ya está registrado');
      throw error;
    }
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await argon2.verify(user.passwordHash, dto.password)))
      throw new UnauthorizedException('Credenciales inválidas');
    return { accessToken: await this.jwt.signAsync({ sub: user.id }) };
  }
}
