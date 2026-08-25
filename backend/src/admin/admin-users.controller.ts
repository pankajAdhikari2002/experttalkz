import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@Controller('api/admin/users')
@UseGuards(AdminAuthGuard)
export class AdminUsersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ─── GET /api/admin/users ───────────────────────────────────────────
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search && search.trim() !== '') {
      const q = `%${search.trim()}%`;
      queryBuilder.where('(user.name LIKE :q OR user.email LIKE :q OR user.mobile LIKE :q)', { q });
    }

    if (role && (role === 'admin' || role === 'user')) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    queryBuilder
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.mobile',
        'user.role',
        'user.is_active',
        'user.created_at',
        'user.updated_at',
      ])
      .orderBy('user.created_at', 'DESC')
      .skip(skip)
      .take(limitNum);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  // ─── POST /api/admin/users (Create a new user or admin) ─────────────
  @Post()
  async create(@Body() body: any) {
    if (!body.email || !body.email.trim()) {
      throw new BadRequestException('Email address is required');
    }
    if (!body.password || body.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const email = body.email.trim().toLowerCase();
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('A user with this email address already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = this.userRepository.create({
      name: body.name ? body.name.trim() : email.split('@')[0],
      email,
      mobile: body.mobile ? body.mobile.trim() : null,
      password: hashedPassword,
      role: body.role === 'admin' ? 'admin' : 'user',
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    });

    const saved = await this.userRepository.save(user);
    const { password, ...safeUser } = saved as any;
    return safeUser;
  }

  // ─── PATCH /api/admin/users/:id/role (Promote/Demote) ──────────────
  @Patch(':id/role')
  async changeRole(
    @Param('id') id: string,
    @Body('role') role: string,
    @Req() req: any,
  ) {
    const userId = parseInt(id, 10);
    if (role !== 'admin' && role !== 'user') {
      throw new BadRequestException('Invalid role. Allowed values: admin, user');
    }

    const targetUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Safety: Admin cannot demote themselves
    if (req.user && req.user.id === userId && role !== 'admin') {
      throw new ForbiddenException('You cannot demote your own admin account');
    }

    targetUser.role = role;
    targetUser.updated_at = new Date();
    await this.userRepository.save(targetUser);

    return {
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
    };
  }

  // ─── PATCH /api/admin/users/:id/status (Activate/Deactivate) ───────
  @Patch(':id/status')
  async toggleStatus(
    @Param('id') id: string,
    @Body('is_active') isActive: boolean,
    @Req() req: any,
  ) {
    const userId = parseInt(id, 10);
    const targetUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Safety: Admin cannot deactivate themselves
    if (req.user && req.user.id === userId && !isActive) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }

    targetUser.is_active = Boolean(isActive);
    targetUser.updated_at = new Date();
    await this.userRepository.save(targetUser);

    return {
      success: true,
      is_active: targetUser.is_active,
      message: `User ${targetUser.is_active ? 'activated' : 'deactivated'} successfully`,
    };
  }

  // ─── DELETE /api/admin/users/:id ────────────────────────────────────
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = parseInt(id, 10);
    const targetUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Safety: Cannot delete own account
    if (req.user && req.user.id === userId) {
      throw new ForbiddenException('You cannot delete your own admin account');
    }

    await this.userRepository.delete(userId);
    return { success: true, message: `Account for ${targetUser.email} has been deleted` };
  }
}
