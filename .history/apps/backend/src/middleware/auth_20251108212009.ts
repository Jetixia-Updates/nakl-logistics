import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import prisma from '../config/postgres';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roleId: string;
    departmentId?: string;
  };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      roleId: string;
      departmentId?: string;
    };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: true,
        department: true,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      departmentId: user.departmentId || undefined,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
}

export function authorize(...permissions: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      // Get user role with permissions
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { role: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const rolePermissions = user.role.permissions as { [key: string]: boolean };

      // Check if user has any of the required permissions
      const hasPermission = permissions.some((permission) => rolePermissions[permission] === true);

      if (!hasPermission) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
