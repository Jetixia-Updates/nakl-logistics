import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: any) => {
    logger.debug('Query: ' + e.query);
    logger.debug('Duration: ' + e.duration + 'ms');
  });
}

export async function connectPostgres() {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected successfully');
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed:', error);
    throw error;
  }
}

export async function disconnectPostgres() {
  await prisma.$disconnect();
  logger.info('PostgreSQL disconnected');
}

export default prisma;
