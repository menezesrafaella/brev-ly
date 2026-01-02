import { API_BASE_URL } from '../config/api'
import type { CreateLinkRequest, LinkResponse } from '../types'

export class ApiError extends Error {
  status: number
  issues?: unknown[]
  
  constructor(
    message: string,
    status: number,
    issues?: unknown[]
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const hasBody = options?.body !== undefined
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(hasBody && { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new ApiError(
      error.message || 'Erro ao processar requisição',
      response.status,
      error.issues
    )
  }

  return response.json()
}

export const api = {
  async createLink(data: CreateLinkRequest): Promise<LinkResponse> {
    return fetchApi<LinkResponse>('/links', {
      method: 'POST',
      body: JSON.stringify({
        originalUrl: data.originalUrl,
        shortenedUrl: data.shortenedUrl.replace(/^brev\.ly\//, ''),
      }),
    })
  },

  async getLinks(params?: {
    page?: number
    pageSize?: number
    sortBy?: 'createdAt' | 'accessCount'
    sortDirection?: 'asc' | 'desc'
  }): Promise<{ total: number; links: LinkResponse[] }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString())
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params?.sortDirection) searchParams.set('sortDirection', params.sortDirection)

    const query = searchParams.toString()
    return fetchApi<{ total: number; links: LinkResponse[] }>(
      `/links${query ? `?${query}` : ''}`
    )
  },

  async getLinkByShortened(shortenedUrl: string): Promise<LinkResponse> {
    const code = shortenedUrl.replace(/^brev\.ly\//, '')
    return fetchApi<LinkResponse>(`/links/${encodeURIComponent(code)}`)
  },

  async deleteLink(shortenedUrl: string): Promise<{ success: boolean }> {
    const code = shortenedUrl.replace(/^brev\.ly\//, '')
    return fetchApi<{ success: boolean }>(`/links/${encodeURIComponent(code)}`, {
      method: 'DELETE',
    })
  },

  async incrementAccess(shortenedUrl: string): Promise<{ success: boolean; accessCount: number }> {
    const code = shortenedUrl.replace(/^brev\.ly\//, '')
    return fetchApi<{ success: boolean; accessCount: number }>(
      `/links/${encodeURIComponent(code)}/access`,
      {
        method: 'PATCH',
      }
    )
  },

  async exportLinks(): Promise<{ reportUrl: string }> {
    return fetchApi<{ reportUrl: string }>('/links/export', {
      method: 'POST',
    })
  },
}

