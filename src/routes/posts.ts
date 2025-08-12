import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PostService } from "src/services";

const getPostsHandler = async (
  request: FastifyRequest<{ Querystring: { limit?: number } }>,
  reply: FastifyReply
) => {
  const limit = request.query?.limit;
  const data = await PostService.getPosts(limit);

  return { data };
};

const getPostByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const data = await PostService.getPostById(id);
  return { data };
};

export const postsRouter = (fastify: FastifyInstance) => {
  fastify.get("/", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          limit: { type: "number", default: 10 },
        },
      },
    },
  }, getPostsHandler);
  fastify.get("/:id", getPostByIdHandler);
};
