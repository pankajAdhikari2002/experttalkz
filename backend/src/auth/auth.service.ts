import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signup(data: any) {
    const existing = await this.usersRepository.findOne({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    
    // Hash password compatibly with standard framework conventions
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    let user = this.usersRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      is_active: true
    });
    user = await this.usersRepository.save(user);

    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
    return {
      success: true,
      message: 'Account created successfully',
      user: { name: user.name, email: user.email },
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(data: any) {
    const user = await this.usersRepository.findOne({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
    return {
      success: true,
      message: 'Logged in successfully',
      user: { name: user.name, email: user.email },
      access_token: this.jwtService.sign(payload),
    };
  }
}
