import { createServer } from "src/server";

const main = async () => {
  const fastify = await createServer();
  const port = Number(fastify.config.PORT);

  try {
    fastify.listen({ port, host: "0.0.0.0" }, () => {
      fastify.log.info(`Listening on 0.0.0.0:${port}...`);
    });
  } catch (error: any) {
    fastify.log.error("fastify.listen:", error);
    process.exit(1);
  }
};

main();
