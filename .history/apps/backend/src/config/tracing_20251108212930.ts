import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { logger } from '../utils/logger';

// Configure OTLP exporter
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  headers: {},
});

// Configure resource with service information
const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'nakl-logistics-backend',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0.0',
    'deployment.environment': process.env.NODE_ENV || 'development',
  })
);

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Customize instrumentation options
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        ignoreIncomingPaths: ['/health', '/favicon.ico'],
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-mongodb': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-pg': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-redis': {
        enabled: true,
      },
    }),
  ],
});

// Initialize tracing
export function initializeTracing(): void {
  try {
    sdk.start();
    logger.info('✅ OpenTelemetry tracing initialized');
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      sdk
        .shutdown()
        .then(() => logger.info('OpenTelemetry tracing terminated'))
        .catch((error) => logger.error('Error terminating tracing', error))
        .finally(() => process.exit(0));
    });
  } catch (error) {
    logger.error('❌ Failed to initialize OpenTelemetry tracing:', error);
  }
}

export default sdk;
