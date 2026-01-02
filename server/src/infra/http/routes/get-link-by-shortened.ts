import { getLinkByShortened } from "../../../app/functions/get-link-by-shortened";
import { isLeft, unwrapEither } from "../../shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getLinkByShortenedRoute: FastifyPluginAsyncZod = async server => {
  server.get('/links/:shortenedUrl', {
    schema: {
      summary: 'Get link by shortened URL',
      tags: ['links'],
      params: z.object({
        shortenedUrl: z.string().min(1, 'URL encurtada não pode estar vazia'),
      }),
      response: {
        200: z.object({
          id: z.string(),
          originalUrl: z.string(),
          shortenedUrl: z.string(),
          accessCount: z.number(),
          createdAt: z.date(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { shortenedUrl } = request.params;

    const result = await getLinkByShortened({ shortenedUrl });

    if (isLeft(result)) {
      return reply.status(404).send({
        message: result.left.message,
      });
    }

    const link = unwrapEither(result);

    return reply.status(200).send(link);
  });
};

