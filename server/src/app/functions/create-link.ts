import { db } from "../../infra/db";
import { schema } from "../../infra/db/schemas";
import { Either, makeLeft, makeRight } from "../../infra/shared/either";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createLinkInput = z.object({
    originalUrl: z.string().url('URL original deve ser uma URL válida'),
    shortenedUrl: z.string()
        .min(1, 'URL encurtada não pode estar vazia')
        .regex(/^[a-zA-Z0-9_-]+$/, 'URL encurtada deve conter apenas letras, números, hífens e underscores')
        .max(100, 'URL encurtada não pode ter mais de 100 caracteres'),
})

type CreateLinkInput = z.input<typeof createLinkInput>

type CreateLinkOutput = {
    id: string;
    originalUrl: string;
    shortenedUrl: string;
    accessCount: number;
    createdAt: Date;
}

type CreateLinkError = 
    | { type: 'INVALID_FORMAT'; message: string }
    | { type: 'ALREADY_EXISTS'; message: string }

export async function createLink(input: CreateLinkInput): Promise<Either<CreateLinkError, CreateLinkOutput>> {
    try {
        const { originalUrl, shortenedUrl } = createLinkInput.parse(input)

        // Verifica se já existe um link com a mesma URL encurtada
        const existingLink = await db
            .select()
            .from(schema.links)
            .where(eq(schema.links.shortenedUrl, shortenedUrl))
            .limit(1)

        if (existingLink.length > 0) {
            return makeLeft({
                type: 'ALREADY_EXISTS',
                message: 'Esta URL encurtada já existe. Escolha outra.'
            })
        }

        // Cria o link
        const [newLink] = await db
            .insert(schema.links)
            .values({
                originalUrl,
                shortenedUrl,
                accessCount: 0,
            })
            .returning()

        return makeRight({
            id: newLink.id,
            originalUrl: newLink.originalUrl,
            shortenedUrl: newLink.shortenedUrl,
            accessCount: newLink.accessCount,
            createdAt: newLink.createdAt,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return makeLeft({
                type: 'INVALID_FORMAT',
                message: error.errors.map(e => e.message).join(', ')
            })
        }
        throw error
    }
}

