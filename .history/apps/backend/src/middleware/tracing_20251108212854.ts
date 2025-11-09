import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { Request, Response, NextFunction } from 'express';

const tracer = trace.getTracer('nakl-logistics-backend');

/**
 * Middleware to add custom attributes to the current span
 */
export function tracingMiddleware(req: Request, res: Response, next: NextFunction) {
  const span = trace.getActiveSpan();
  
  if (span) {
    // Add custom attributes to the span
    span.setAttribute('http.user_agent', req.get('user-agent') || 'unknown');
    span.setAttribute('http.client_ip', req.ip || 'unknown');
    
    // Add user information if authenticated
    if (req.user) {
      span.setAttribute('user.id', (req as any).user.id);
      span.setAttribute('user.email', (req as any).user.email);
    }
  }
  
  next();
}

/**
 * Helper function to create a custom span for a specific operation
 * Use this for operations that need detailed tracing
 */
export async function withSpan<T>(
  name: string,
  operation: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      // Add custom attributes
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }
      
      // Execute the operation
      const result = await operation();
      
      // Mark span as successful
      span.setStatus({ code: SpanStatusCode.OK });
      
      return result;
    } catch (error) {
      // Record the error
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Helper to get the current trace ID for logging correlation
 */
export function getCurrentTraceId(): string | undefined {
  const span = trace.getActiveSpan();
  if (span) {
    return span.spanContext().traceId;
  }
  return undefined;
}
