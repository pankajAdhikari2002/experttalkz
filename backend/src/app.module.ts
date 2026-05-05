import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category } from './entities/category.entity';
import { Course } from './entities/course.entity';
import { CourseInstallment } from './entities/course-installment.entity';
import { Blog } from './entities/blog.entity';
import { Award } from './entities/award.entity';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';

// ─── Feature Modules ───────────────────────────────────────────────────────
// Uncomment each line as you create the module folder
// import { CoursesModule } from './courses/courses.module';
// import { BlogsModule } from './blogs/blogs.module';
// import { CategoriesModule } from './categories/categories.module';
// import { AwardsModule } from './awards/awards.module';
// import { LeadsModule } from './leads/leads.module';
// import { SettingsModule } from './settings/settings.module';
// import { TestimonialsModule } from './testimonials/testimonials.module';

@Module({
  imports: [
    // ─── 1. Environment Variables ─────────────────────────────────────────
    // Loads .env from project root and makes ConfigService available globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ─── 2. MySQL Database Connection ─────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',

        // Reads from your .env file
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'presto_admin'),

        // Auto-discovers all *.entity.ts files in any subfolder
        // No need to manually list entities here — just create the file
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        // ⚠️  MUST stay false — your DB already exists with real data
        // Setting true would let TypeORM alter/drop your tables automatically
        synchronize: false,

        // Shows the raw SQL queries in your terminal during development
        // Very helpful for debugging — set to false in production
        logging: process.env.NODE_ENV !== 'production',

        // Keeps the MySQL connection alive (prevents timeout drops)
        keepConnectionAlive: true,

        // Charset to match your DB (your SQL dump uses utf8mb4)
        charset: 'utf8mb4_unicode_ci',
      }),
    }),

    // ─── 3. Feature Modules ───────────────────────────────────────────────
    // Add each module here as you build them out.
    // Each module handles its own TypeOrmModule.forFeature([Entity]) internally.
    // CoursesModule,
    // BlogsModule,
    // CategoriesModule,
    // AwardsModule,
    // LeadsModule,
    // SettingsModule,
    // TestimonialsModule,
    TypeOrmModule.forFeature([Category, Course, CourseInstallment, Blog, Award]),
    AuthModule,
    PaymentsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}