export interface LinkResponse {
  id: string
  originalUrl: string
  shortenedUrl: string
  accessCount: number
  createdAt: string | Date
}

export interface Link {
  id: string
  original: string
  shortened: string
  accessCount: number
  createdAt?: Date
}
export interface CreateLinkRequest {
  originalUrl: string
  shortenedUrl: string
}

