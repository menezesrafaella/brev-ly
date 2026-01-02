import { createLink } from "../../../app/functions/create-link";
import { isLeft, unwrapEither } from "../../shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post('/links', {
    schema: {
      summary: 'Create a new shortened link',
      tags: ['links'],
      body: z.object({
        originalUrl: z.string().url('URL original deve ser uma URL válida'),
        shortenedUrl: z.string()
          .min(1, 'URL encurtada não pode estar vazia')
          .regex(/^[a-zA-Z0-9_-]+$/, 'URL encurtada deve conter apenas letras, números, hífens e underscores')
          .max(100, 'URL encurtada não pode ter mais de 100 caracteres'),
      }),
      response: {
        201: z.object({
          id: z.string(),
          originalUrl: z.string(),
          shortenedUrl: z.string(),
          accessCount: z.number(),
          createdAt: z.date(),
        }),
        400: z.object({
          message: z.string(),
        }),
        409: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { originalUrl, shortenedUrl } = request.body;

    const result = await createLink({
      originalUrl,
      shortenedUrl,
    });

    if (isLeft(result)) {
      if (result.left.type === 'ALREADY_EXISTS') {
        return reply.status(409).send({
          message: result.left.message,
        });
      }
      return reply.status(400).send({
        message: result.left.message,
      });
    }

    const link = unwrapEither(result);

    return reply.status(201).send(link);
  });
};

