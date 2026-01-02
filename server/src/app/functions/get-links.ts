import { db } from "../../infra/db";
import { schema } from "../../infra/db/schemas";
import { Either, makeRight } from "../../infra/shared/either";
import { asc, count, desc } from "drizzle-orm";
import { z } from "zod";

const getLinksInput = z.object({
    sortBy: z.enum(['createdAt', 'accessCount']).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
    page: z.number().optional().default(1),
    pageSize: z.number().optional().default(20),
})

type GetLinksInput = z.input<typeof getLinksInput>

type GetLinksOutput = {
    total: number;
    links: {
        id: string
        originalUrl: string
        shortenedUrl: string
        accessCount: number
        createdAt: Date
    }[]
}

export async function getLinks(input: GetLinksInput): Promise<Either<never, GetLinksOutput>> {
    const { sortBy, sortDirection, page, pageSize } = getLinksInput.parse(input)

    const links = await db
        .select({
            id: schema.links.id,
            originalUrl: schema.links.originalUrl,
            shortenedUrl: schema.links.shortenedUrl,
            accessCount: schema.links.accessCount,
            createdAt: schema.links.createdAt,
        })
        .from(schema.links)
        .orderBy(fields => {
            if (sortBy === 'createdAt' && sortDirection === 'asc') {
                return asc(fields.createdAt)
            }
            if (sortBy === 'createdAt' && sortDirection === 'desc') {
                return desc(fields.createdAt)
            }
            if (sortBy === 'accessCount' && sortDirection === 'asc') {
                return asc(fields.accessCount)
            }
            if (sortBy === 'accessCount' && sortDirection === 'desc') {
                return desc(fields.accessCount)
            }
            return desc(fields.createdAt)
        })
        .offset((page - 1) * pageSize)
        .limit(pageSize);

    const [{ total }] = await db
        .select({ total: count(schema.links.id) })
        .from(schema.links);

    return makeRight({ links, total })
}

