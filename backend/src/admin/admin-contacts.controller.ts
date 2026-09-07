import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@Controller('api/admin/contacts')
@UseGuards(AdminAuthGuard)
export class AdminContactsController {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  // List all contacts with optional search, status filter, and pagination
  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search = '',
    @Query('status') status = '',
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const queryBuilder = this.contactRepo.createQueryBuilder('contact');

    if (search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      queryBuilder.where(
        '(LOWER(contact.name) LIKE :q OR LOWER(contact.email) LIKE :q OR LOWER(contact.phone) LIKE :q OR LOWER(contact.subject) LIKE :q OR LOWER(contact.message) LIKE :q)',
        { q },
      );
    }

    if (status && status !== 'all') {
      queryBuilder.andWhere('contact.status = :status', { status });
    }

    queryBuilder.orderBy('contact.created_at', 'DESC');
    queryBuilder.skip(skip).take(limitNum);

    const [items, total] = await queryBuilder.getManyAndCount();

    // Also get unread count
    const unreadCount = await this.contactRepo.count({ where: { status: 'unread' } });

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      unreadCount,
    };
  }

  // Get unread contact count for badge
  @Get('unread-count')
  async getUnreadCount() {
    const count = await this.contactRepo.count({ where: { status: 'unread' } });
    return { unreadCount: count };
  }

  // Get single contact message details
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contact = await this.contactRepo.findOne({ where: { id: parseInt(id, 10) } });
    if (!contact) throw new NotFoundException('Contact message not found');
    return contact;
  }

  // Update status (e.g. read, unread, replied)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const contact = await this.contactRepo.findOne({ where: { id: parseInt(id, 10) } });
    if (!contact) throw new NotFoundException('Contact message not found');

    contact.status = status || 'read';
    await this.contactRepo.save(contact);
    return { success: true, message: `Status updated to ${contact.status}`, contact };
  }

  // Delete message
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const contact = await this.contactRepo.findOne({ where: { id: parseInt(id, 10) } });
    if (!contact) throw new NotFoundException('Contact message not found');

    await this.contactRepo.remove(contact);
    return { success: true, message: 'Message deleted successfully' };
  }
}
