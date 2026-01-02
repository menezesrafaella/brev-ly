import { db } from "../../infra/db";
import { schema } from "../../infra/db/schemas";
import { Either, makeLeft, makeRight } from "../../infra/shared/either";
import { eq } from "drizzle-orm";
import { z } from "zod";

const getLinkByShortenedInput = z.object({
    shortenedUrl: z.string().min(1, 'URL encurtada não pode estar vazia'),
})

type GetLinkByShortenedInput = z.input<typeof getLinkByShortenedInput>

type GetLinkByShortenedOutput = {
    id: string;
    originalUrl: string;
    shortenedUrl: string;
    accessCount: number;
    createdAt: Date;
}

type GetLinkByShortenedError = {
    type: 'NOT_FOUND';
    message: string;
}

export async function getLinkByShortened(input: GetLinkByShortenedInput): Promise<Either<GetLinkByShortenedError, GetLinkByShortenedOutput>> {
    const { shortenedUrl } = getLinkByShortenedInput.parse(input)

    const [link] = await db
        .select()
        .from(schema.links)
        .where(eq(schema.links.shortenedUrl, shortenedUrl))
        .limit(1)

    if (!link) {
        return makeLeft({
            type: 'NOT_FOUND',
            message: 'Link não encontrado'
        })
    }

    return makeRight({
        id: link.id,
        originalUrl: link.originalUrl,
        shortenedUrl: link.shortenedUrl,
        accessCount: link.accessCount,
        createdAt: link.createdAt,
    })
}

