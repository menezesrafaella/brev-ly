import type { Link, LinkResponse } from '../types'

export function adaptLinkResponse(linkResponse: LinkResponse): Link {
  return {
    id: linkResponse.id,
    original: linkResponse.originalUrl,
    shortened: `brev.ly/${linkResponse.shortenedUrl}`,
    accessCount: linkResponse.accessCount,
    createdAt: linkResponse.createdAt instanceof Date 
      ? linkResponse.createdAt 
      : new Date(linkResponse.createdAt),
  }
}

export function adaptLinksResponse(linksResponse: LinkResponse[]): Link[] {
  return linksResponse.map(adaptLinkResponse)
}

