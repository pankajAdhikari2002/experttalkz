import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Precomputed bcrypt hash used to equalize response timing when a user does not exist (mitigates timing/enumeration attacks)
const DUMMY_HASH = '$2b$10$7EqJtq98hPqEX7fNZaFWoO0V2.Z12nS/c6Fm3o7N1qK8a6mP9L6Qe';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s.'\-\u00C0-\u024F\u1E00-\u1EFF]+$/;
// SQL injection probe patterns to instantly reject malicious payloads
const SQL_INJECTION_PATTERN = /('|\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|TRUNCATE|DECLARE)\b|--|\/\*|\*\/|;|\0)/i;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  /**
   * Validates password complexity:
   * - 8 to 72 characters (72 bytes is bcrypt limit)
   * - At least 1 uppercase letter
   * - At least 1 lowercase letter
   * - At least 1 numeric digit
   * - At least 1 special character
   */
  private validatePasswordFormat(password: string): void {
    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Password is required.');
    }
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }
    if (password.length > 72) {
      throw new BadRequestException('Password cannot exceed 72 characters.');
    }
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter (A-Z).');
    }
    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one lowercase letter (a-z).');
    }
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one number (0-9).');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
      throw new BadRequestException('Password must contain at least one special character (e.g. !@#$%^&*).');
    }
  }

  /**
   * Sanitizes and validates email string, ensuring immunity against SQL/NoSQL query injection
   */
  private sanitizeAndValidateEmail(rawEmail: any): string {
    if (!rawEmail || typeof rawEmail !== 'string') {
      throw new BadRequestException('Valid email address is required.');
    }
    const email = rawEmail.trim().toLowerCase();
    if (email.length > 100) {
      throw new BadRequestException('Email address cannot exceed 100 characters.');
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestException('Please provide a valid email address (e.g. user@domain.com).');
    }
    if (SQL_INJECTION_PATTERN.test(email)) {
      throw new BadRequestException('Invalid characters detected in email.');
    }
    return email;
  }

  async signup(data: any) {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Invalid signup request.');
    }

    // 1. Sanitize & validate Full Name
    if (!data.name || typeof data.name !== 'string') {
      throw new BadRequestException('Full name is required.');
    }
    const name = data.name.trim();
    if (name.length < 2) {
      throw new BadRequestException('Name must be at least 2 characters long.');
    }
    if (name.length > 70) {
      throw new BadRequestException('Name cannot exceed 70 characters.');
    }
    if (!NAME_REGEX.test(name) || SQL_INJECTION_PATTERN.test(name)) {
      throw new BadRequestException('Name can only contain letters, spaces, hyphens, and periods.');
    }

    // 2. Sanitize & validate Email
    const email = this.sanitizeAndValidateEmail(data.email);

    // 3. Validate Password Complexity
    this.validatePasswordFormat(data.password);

    // 4. Check for existing user via parameterized query
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with this email address already exists. Please sign in.');
    }
    
    // 5. Hash password with bcrypt cost factor 10
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    let user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    user = await this.usersRepository.save(user);

    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
    return {
      success: true,
      message: 'Account created successfully! Welcome to ExpertTalkz.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(data: any) {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Invalid login request.');
    }

    // 1. Validate and sanitize Email
    const email = this.sanitizeAndValidateEmail(data.email);

    // 2. Verify password input
    if (!data.password || typeof data.password !== 'string') {
      throw new BadRequestException('Password is required.');
    }

    // 3. Find user using parameterized query
    const user = await this.usersRepository.findOne({ where: { email } });

    // 4. Timing-attack immune verification
    if (!user) {
      // Run dummy compare so response time is identical
      await bcrypt.compare(data.password, DUMMY_HASH);
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 5. Account status check
    if (!user.is_active) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    // 6. Verify password hash
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
    return {
      success: true,
      message: 'Logged in successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: number) {
    if (!userId) {
      throw new UnauthorizedException('Invalid session');
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User session not found');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    };
  }
}

