import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NewPost } from "src/db/schema";
import { PostService } from "src/services";

const getPostsHandler = async (request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) => {
  const limit = request.query?.limit;
  const data = await PostService.getPosts(limit);

  return { data };
};

const getPostByIdHandler = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  const data = await PostService.getPostById(id);
  return { data };
};

const createPostHandler = async (request: FastifyRequest<{ Body: NewPost }>, reply: FastifyReply) => {
  const post = request.body;
  const data = await PostService.createPost(post);
  return reply.code(201).send({ data });
};

export const postsRouter = (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            limit: { type: "number", default: 10 },
          },
        },
      },
    },
    getPostsHandler,
  );

  fastify.get("/:id", getPostByIdHandler);

  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: { type: "string", maxLength: 24 },
            content: { type: "string" },
          },
        },
      },
    },
    createPostHandler,
  );
};
