import * as Sentry from "@sentry/react-router";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
Sentry.init({
  dsn: "https://3f8342df2e9fd1f06d9513e8efedfe37@o4508573214310400.ingest.us.sentry.io/4510294827401216",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  // Add our Profiling integration
  integrations: [nodeProfilingIntegration()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#tracesSampleRate
  tracesSampleRate: 1.0,
  // Set profilesSampleRate to 1.0 to profile 100%
  // of sampled transactions.
  // This is relative to tracesSampleRate
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#profilesSampleRate
  profilesSampleRate: 1.0,
});