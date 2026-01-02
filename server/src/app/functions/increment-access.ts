import { db } from "../../infra/db";
import { schema } from "../../infra/db/schemas";
import { Either, makeLeft, makeRight } from "../../infra/shared/either";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const incrementAccessInput = z.object({
    shortenedUrl: z.string().min(1, 'URL encurtada não pode estar vazia'),
})

type IncrementAccessInput = z.input<typeof incrementAccessInput>

type IncrementAccessOutput = {
    success: boolean;
    accessCount: number;
}

type IncrementAccessError = {
    type: 'NOT_FOUND';
    message: string;
}

export async function incrementAccess(input: IncrementAccessInput): Promise<Either<IncrementAccessError, IncrementAccessOutput>> {
    const { shortenedUrl } = incrementAccessInput.parse(input)

    // Primeiro verifica se o link existe
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

    // Incrementa o contador de acessos
    const [updatedLink] = await db
        .update(schema.links)
        .set({
            accessCount: sql`${schema.links.accessCount} + 1`
        })
        .where(eq(schema.links.shortenedUrl, shortenedUrl))
        .returning()

    return makeRight({
        success: true,
        accessCount: updatedLink.accessCount,
    })
}

