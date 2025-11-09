import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nakl_logistics';

    await mongoose.connect(mongoUri);

    logger.info('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

export async function disconnectMongoDB() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

export default mongoose;
