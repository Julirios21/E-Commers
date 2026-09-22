import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(user);
    return this.buildResponse(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      select: { id: true, name: true, email: true, password: true, role: true },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.buildResponse(user);
  }

  private buildResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
