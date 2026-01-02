import { deleteLink } from "../../../app/functions/delete-link";
import { isLeft, unwrapEither } from "../../shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete('/links/:shortenedUrl', {
    schema: {
      summary: 'Delete a link',
      tags: ['links'],
      params: z.object({
        shortenedUrl: z.string().min(1, 'URL encurtada não pode estar vazia'),
      }),
      response: {
        200: z.object({
          success: z.boolean(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    const { shortenedUrl } = request.params;

    const result = await deleteLink({ shortenedUrl });

    if (isLeft(result)) {
      return reply.status(404).send({
        message: result.left.message,
      });
    }

    const output = unwrapEither(result);

    return reply.status(200).send(output);
  });
};

