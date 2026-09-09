import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService manages database lifecycle and connections.
 * Extends PrismaClient to inject database queries across all backend modules.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('🚀 Connected to PostgreSQL database via Prisma');
    } catch (error) {
      this.logger.error('❌ Failed to connect to PostgreSQL database:', error.message);
      // Allow app to boot for inspection or dev mode even if DB is spinning up
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Closed database connection');
  }
}
