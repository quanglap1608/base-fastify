import Fastify from "fastify";
import env from "@fastify/env";
import { createLogger } from "src/utils/logger";
import dotenv from "dotenv";
import { Level } from "pino";
import { postsRouter } from "src/routes/posts";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

const schema = {
  type: "object",
  required: ["PORT", "DATABASE_URL"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
    DATABASE_URL: {
      type: "string",
    },
    PINO_LOG_LEVEL: {
      type: "string",
      default: "error",
    },
    NODE_ENV: {
      type: "string",
      default: "production",
    },
  },
};

const options = {
  schema: schema,
  dotenv: true,
};

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: string;
      DATABASE_URL: string;
      PINO_LOG_LEVEL: string;
      NODE_ENV: string;
    };
  }
}

dotenv.config();

const level = process.env.PINO_LOG_LEVEL as Level;
const isDev = process.env.NODE_ENV === "development";
const logger = createLogger({ level, isDev });

export const createServer = async () => {
  const fastify = Fastify({
    loggerInstance: logger,
  });

  /* Register plugins */
  await fastify.register(env, options).after();

  /* Register Swagger */
  await fastify.register(swagger);
  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
  });

  /* Health check */
  fastify.get("/", (request, reply) => {
    reply.send({ message: "Health check passed" });
  });

  /* Register routes */
  fastify.register(postsRouter, { prefix: "api/posts" });

  return fastify;
};
