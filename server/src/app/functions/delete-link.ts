import { db } from "../../infra/db";
import { schema } from "../../infra/db/schemas";
import { Either, makeLeft, makeRight } from "../../infra/shared/either";
import { eq } from "drizzle-orm";
import { z } from "zod";

const deleteLinkInput = z.object({
    shortenedUrl: z.string().min(1, 'URL encurtada não pode estar vazia'),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

type DeleteLinkOutput = {
    success: boolean;
}

type DeleteLinkError = {
    type: 'NOT_FOUND';
    message: string;
}

export async function deleteLink(input: DeleteLinkInput): Promise<Either<DeleteLinkError, DeleteLinkOutput>> {
    const { shortenedUrl } = deleteLinkInput.parse(input)

    const [deletedLink] = await db
        .delete(schema.links)
        .where(eq(schema.links.shortenedUrl, shortenedUrl))
        .returning()

    if (!deletedLink) {
        return makeLeft({
            type: 'NOT_FOUND',
            message: 'Link não encontrado'
        })
    }

    return makeRight({ success: true })
}

