import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/postgres';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

// Generate JWT token
function generateToken(userId: string, email: string, roleId: string, departmentId?: string) {
  return jwt.sign(
    { id: userId, email, roleId, departmentId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Generate refresh token
function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
}

// POST /api/auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        department: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is inactive', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

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
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLoginAt: true,
        role: true,
        department: true,
        createdAt: true,
        updatedAt: true,
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
