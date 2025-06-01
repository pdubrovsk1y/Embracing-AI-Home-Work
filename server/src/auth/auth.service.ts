import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingAuth = await this.authRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingAuth) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Create auth record
    const auth = this.authRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password_hash: passwordHash,
    });

    await this.authRepository.save(auth);

    return {
      message: 'User registered successfully',
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const auth = await this.authRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      auth.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { email: auth.email, sub: auth.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
