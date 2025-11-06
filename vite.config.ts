import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from '@sentry/react-router';

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "tomore",
  project: "travel-agency",

  authToken: process.env.SENTRY_AUTH_TOKEN,
  // ...
};

export default defineConfig(config =>{
  return{
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), sentryReactRouter(sentryConfig, config)],
    ssr: {
    noExternal: [/@syncfusion/]
    }
  }
});
