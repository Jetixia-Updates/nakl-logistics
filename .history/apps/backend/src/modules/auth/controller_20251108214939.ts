import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/postgres';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { withSpan } from '../../middleware/tracing';

// Generate JWT token
function generateToken(userId: string, email: string, roleId: string, departmentId?: string): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: userId, email, roleId, departmentId },
    secret,
    { expiresIn }
  );
}

// Generate refresh token
function generateRefreshToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
}

// POST /api/auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Find user with tracing
    const user = await withSpan(
      'auth.find_user',
      async () => {
        return prisma.user.findUnique({
          where: { email },
          include: {
            role: true,
            department: true,
          },
        });
      },
      { 'user.email': email }
    );

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is inactive', 401);
    }

    // Verify password with tracing
    const isValidPassword = await withSpan(
      'auth.verify_password',
      async () => bcrypt.compare(password, user.password),
      { 'user.id': user.id }
    );

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await withSpan(
      'auth.update_last_login',
      async () => {
        return prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      },
      { 'user.id': user.id }
    );

    // Generate tokens
    const token = generateToken(user.id, user.email, user.roleId, user.departmentId || undefined);
    const refreshToken = generateRefreshToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/register
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, firstName, lastName, phone, roleId, departmentId } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        roleId,
        departmentId,
      },
      include: {
        role: true,
        department: true,
      },
    });

    // Generate tokens
    const token = generateToken(user.id, user.email, user.roleId, user.departmentId || undefined);
    const refreshToken = generateRefreshToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/refresh
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { id: string };

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true, department: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const newToken = generateToken(
      user.id,
      user.email,
      user.roleId,
      user.departmentId || undefined
    );
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      status: 'success',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
export async function getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        role: true,
        department: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/logout
export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // In a real application, you might want to blacklist the token
    // or use a token store like Redis

    res.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}
