// Initialize tracing first (before any other imports)
import { initializeTracing } from './config/tracing';
initializeTracing();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectPostgres } from './config/postgres';
import { connectMongoDB } from './config/mongodb';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/users/routes';
import accountRoutes from './modules/accounting/routes';
import tenderRoutes from './modules/tenders/routes';
import workOrderRoutes from './modules/workOrders/routes';
import vendorRoutes from './modules/vendors/routes';
import customerRoutes from './modules/customers/routes';
import invoiceRoutes from './modules/invoices/routes';
import paymentRoutes from './modules/payments/routes';
import vehicleRoutes from './modules/vehicles/routes';
import gpsRoutes from './modules/gps/routes';
import warehouseRoutes from './modules/warehouse/routes';
import reportRoutes from './modules/reports/routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;
const API_PREFIX = process.env.API_PREFIX || '/api';

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(`${API_PREFIX}/`, limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Tracing middleware
import { tracingMiddleware } from './middleware/tracing';
app.use(tracingMiddleware);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/accounts`, accountRoutes);
app.use(`${API_PREFIX}/tenders`, tenderRoutes);
app.use(`${API_PREFIX}/work-orders`, workOrderRoutes);
app.use(`${API_PREFIX}/vendors`, vendorRoutes);
app.use(`${API_PREFIX}/customers`, customerRoutes);
app.use(`${API_PREFIX}/invoices`, invoiceRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/vehicles`, vehicleRoutes);
app.use(`${API_PREFIX}/gps`, gpsRoutes);
app.use(`${API_PREFIX}/warehouse`, warehouseRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use(errorHandler);

// ============================================
// SERVER START
// ============================================

async function startServer() {
  try {
    // Connect to databases
    logger.info('Connecting to databases...');
    // await connectPostgres(); // Commented out until DB is ready
    // await connectMongoDB(); // Commented out until DB is ready
    logger.info('Server starting without database connections (development mode)');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📍 API: http://localhost:${PORT}${API_PREFIX}`);
      logger.info(`🏥 Health: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

export default app;
