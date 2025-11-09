# OpenTelemetry Tracing Setup

## Overview

This project uses OpenTelemetry for distributed tracing to monitor and debug the application's performance and behavior.

## Features

- ✅ Automatic instrumentation for:
  - HTTP requests (Express routes)
  - Database queries (PostgreSQL via Prisma, MongoDB via Mongoose)
  - Redis operations
  - External HTTP calls
- ✅ Custom span creation for specific operations
- ✅ Trace correlation with logs
- ✅ OTLP export to local or remote collectors

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# OpenTelemetry Configuration
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
OTEL_SERVICE_NAME=nakl-logistics-backend
```

### Viewing Traces

#### Option 1: Using AI Toolkit (Recommended for Development)

The AI Toolkit in VS Code has built-in trace viewing capabilities:

1. Open VS Code Command Palette (Cmd+Shift+P)
2. Search for "AI Toolkit: Open Tracing"
3. View your traces in the AI Toolkit interface

#### Option 2: Using Jaeger (Self-hosted)

Run Jaeger locally with Docker:

```bash
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```

Then access the Jaeger UI at: http://localhost:16686

#### Option 3: Using Azure Application Insights

Update your `.env` with Azure connection string:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-region.in.applicationinsights.azure.com/v1/traces
APPLICATIONINSIGHTS_CONNECTION_STRING=your_connection_string
```

## Usage

### Automatic Tracing

All HTTP requests, database queries, and external calls are automatically traced. No additional code needed!

### Custom Spans

For operations that need detailed tracing, use the `withSpan` helper:

```typescript
import { withSpan } from '../../middleware/tracing';

// Example: Tracing a complex business operation
export async function processTender(tenderId: string) {
  return await withSpan(
    'tender.process',
    async () => {
      // Your business logic here
      const tender = await getTender(tenderId);
      await validateTender(tender);
      await submitBid(tender);
      return tender;
    },
    {
      'tender.id': tenderId,
      'operation.type': 'bid_submission'
    }
  );
}
```

### Adding Custom Attributes

The tracing middleware automatically adds:
- User ID and email (when authenticated)
- Client IP address
- User agent

You can add more attributes in the middleware or using `withSpan`.

### Trace Correlation with Logs

Get the current trace ID to correlate logs:

```typescript
import { getCurrentTraceId } from '../../middleware/tracing';

const traceId = getCurrentTraceId();
logger.info('Processing order', { traceId, orderId });
```

## Best Practices

1. **Use Automatic Instrumentation**: Let OpenTelemetry automatically trace HTTP, DB, and external calls
2. **Add Custom Spans Sparingly**: Only for critical business operations that need detailed tracking
3. **Keep Span Names Descriptive**: Use format like `module.operation` (e.g., `auth.login`, `order.create`)
4. **Add Relevant Attributes**: Include IDs and key parameters for better debugging
5. **Don't Over-Instrument**: Too many spans can impact performance

## Troubleshooting

### Traces Not Appearing

1. Check if the OTLP endpoint is accessible:
   ```bash
   curl http://localhost:4318/v1/traces
   ```

2. Verify environment variables are set correctly

3. Check application logs for OpenTelemetry initialization messages

### Performance Impact

- Automatic instrumentation has minimal overhead (<5%)
- Custom spans add ~1-2ms per span
- Consider sampling in production (e.g., 10% of requests)

## Production Considerations

1. **Use Sampling**: Configure sampling to reduce data volume
2. **Secure Endpoints**: Use authentication for production OTLP endpoints
3. **Monitor Costs**: Be aware of ingestion and storage costs
4. **Set Retention Policies**: Configure appropriate data retention

## Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry JavaScript](https://github.com/open-telemetry/opentelemetry-js)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/)
- [Azure Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
