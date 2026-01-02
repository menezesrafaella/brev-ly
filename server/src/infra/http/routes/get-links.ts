import { getLinks } from "../../../app/functions/get-links";
import { unwrapEither } from "../../shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get('/links', {
    schema: {
      summary: 'Get all links',
      tags: ['links'],
      querystring: z.object({
        sortBy: z.enum(['createdAt', 'accessCount']).optional(),
        sortDirection: z.enum(['asc', 'desc']).optional(),
        page: z.coerce.number().optional().default(1),
        pageSize: z.coerce.number().optional().default(20),
      }),
      response: {
        200: z.object({
          total: z.number(),
          links: z.array(z.object({
            id: z.string(),
            originalUrl: z.string(),
            shortenedUrl: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          })),
        }),
      },
    },
  }, async (request, reply) => {
    const { sortBy, sortDirection, page, pageSize } = request.query;

    const result = await getLinks({
      sortBy,
      sortDirection,
      page,
      pageSize
    });

    const { total, links } = unwrapEither(result);

    return reply.status(200).send({ total, links });
  });
};

