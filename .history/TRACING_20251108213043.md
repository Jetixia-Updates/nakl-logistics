# OpenTelemetry Tracing - Quick Reference

## ✅ What Was Added

### 1. Dependencies (`apps/backend/package.json`)
- `@opentelemetry/api` - Core OpenTelemetry API
- `@opentelemetry/sdk-node` - Node.js SDK
- `@opentelemetry/auto-instrumentations-node` - Automatic instrumentation
- `@opentelemetry/exporter-trace-otlp-http` - OTLP HTTP exporter
- `@opentelemetry/resources` & `@opentelemetry/semantic-conventions`

### 2. Configuration Files

**`src/config/tracing.ts`**
- Initializes OpenTelemetry SDK
- Configures automatic instrumentation for:
  - HTTP/Express
  - MongoDB
  - PostgreSQL
  - Redis
- Sets up OTLP exporter (localhost:4318 by default)

**`src/middleware/tracing.ts`**
- Custom tracing middleware
- `withSpan()` helper for manual span creation
- `getCurrentTraceId()` for log correlation

### 3. Integration

**`src/index.ts`**
- Tracing initialized at app startup (before any other imports)
- Tracing middleware added to Express pipeline

**`src/modules/auth/controller.ts`**
- Example usage of custom spans in login function

### 4. Documentation

- **`docs/tracing-guide.md`** - Complete tracing guide
- **`docs/development-guide.md`** - Updated with tracing info

## 🚀 Getting Started

### Install Dependencies
```bash
cd apps/backend
npm install
```

### View Traces

#### Option 1: AI Toolkit (Built-in VS Code)
1. Run your app: `npm run dev`
2. Make some requests
3. Open Command Palette: Cmd+Shift+P
4. Type "AI Toolkit: Open Tracing"
5. View your traces!

#### Option 2: Jaeger (Local)
```bash
# Start Jaeger
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest

# Open Jaeger UI
open http://localhost:16686
```

## 📊 What Gets Traced Automatically

✅ All HTTP requests to your API
✅ Database queries (Prisma + Mongoose)
✅ Redis operations
✅ External HTTP calls
✅ User authentication info (when logged in)

## 🎯 Example: Custom Tracing

```typescript
import { withSpan } from '../../middleware/tracing';

export async function createWorkOrder(data: WorkOrderData) {
  return await withSpan(
    'workorder.create',
    async () => {
      // Your business logic
      const order = await WorkOrder.create(data);
      await assignVehicle(order.id);
      return order;
    },
    {
      'customer.id': data.customerId,
      'order.type': data.sourceType
    }
  );
}
```

## 🔍 Debugging with Traces

1. **Find slow operations**: Look for spans with high duration
2. **Track user journeys**: Follow trace IDs across services
3. **Identify errors**: Spans marked with ERROR status
4. **Correlate with logs**: Use trace IDs in log messages

## 📝 Environment Variables

Add to `.env`:
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
OTEL_SERVICE_NAME=nakl-logistics-backend
```

## 🎨 Trace Attributes Added

- `http.user_agent` - Client user agent
- `http.client_ip` - Client IP address
- `user.id` - Authenticated user ID
- `user.email` - Authenticated user email
- Custom attributes via `withSpan()`

## ⚡ Performance

- Automatic instrumentation: <5% overhead
- Custom spans: ~1-2ms per span
- Recommended: Use sampling in production (10-20% of requests)

## 🛠️ Troubleshooting

**Traces not showing?**
1. Check if OTLP endpoint is running: `curl http://localhost:4318/v1/traces`
2. Check logs for OpenTelemetry initialization messages
3. Verify environment variables are set

**Too much data?**
1. Configure sampling in `src/config/tracing.ts`
2. Filter out health check endpoints
3. Reduce custom span usage

## 📚 Learn More

- Full documentation: `docs/tracing-guide.md`
- OpenTelemetry Docs: https://opentelemetry.io/docs/
- Jaeger Docs: https://www.jaegertracing.io/docs/
