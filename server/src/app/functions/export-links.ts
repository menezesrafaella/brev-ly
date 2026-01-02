import { stringify } from "csv-stringify";
import { randomUUID } from "node:crypto";
import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { z } from "zod";
import { db, pg } from "../../infra/db";
import { schema } from "../../infra/db/schemas";
import { Either, makeRight } from "../../infra/shared/either";
import { uploadFileToStorage } from "../../infra/storage/upload-file-to-storage";

const exportLinksInput = z.object({})

type ExportLinksInput = z.input<typeof exportLinksInput>

type ExportLinksOutput = {
    reportUrl: string;
}

export async function exportLinks(input: ExportLinksInput): Promise<Either<never, ExportLinksOutput>> {
    exportLinksInput.parse(input)

    const { sql, params } = await db
        .select({
            originalUrl: schema.links.originalUrl,
            shortenedUrl: schema.links.shortenedUrl,
            accessCount: schema.links.accessCount,
            createdAt: schema.links.createdAt,
        })
        .from(schema.links)
        .toSQL();

    const cursor = pg.unsafe(sql, params as string[]).cursor(50);

    const csv = stringify({
        delimiter: ',',
        header: true,
        columns: [
            { key: 'original_url', header: 'URL Original' },
            { key: 'shortened_url', header: 'URL Encurtada' },
            { key: 'access_count', header: 'Acessos' },
            { key: 'created_at', header: 'Data de Criação' },
        ]
    })

    const uploadToStorageStream = new PassThrough();

    const convertToCSVPipeline = pipeline(
        cursor,
        new Transform({
            objectMode: true,
            transform(chunks: unknown[], encoding, callback) {
                for (const chunk of chunks) {
                    this.push(chunk)
                }
                callback()
            },
        }),
        csv,
        uploadToStorageStream
    )

    const fileName = `${randomUUID()}-links-${Date.now()}.csv`

    const uploadToStorage = uploadFileToStorage({
        contentType: 'text/csv',
        folder: 'downloads',
        fileName,
        contentStream: uploadToStorageStream
    })

    await Promise.all([
        uploadToStorage,
        convertToCSVPipeline,
    ])

    const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

    return makeRight({ reportUrl: url })
}

