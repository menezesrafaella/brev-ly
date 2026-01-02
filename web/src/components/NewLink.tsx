import { useState } from 'react'
import { api } from '../services/api'
import type { Link } from '../types'

interface NewLinkProps {
  onAddLink: (link: Link) => void
  existingLinks: Link[]
  onLinkCreated?: () => void
}

export default function NewLink({ onAddLink, existingLinks, onLinkCreated }: NewLinkProps) {
  const [linkOriginal, setLinkOriginal] = useState('')
  const [linkShortened, setLinkShortened] = useState('brev.ly/')
  const [error, setError] = useState<string>('')

  const validateShortened = (shortened: string): boolean => {
    const code = shortened.replace(/^brev\.ly\//, '').trim()
    
    if (!code || code.length === 0) {
      return false
    }
    
    const validPattern = /^[a-zA-Z0-9_-]+$/
    return validPattern.test(code)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!linkOriginal.trim() || !linkShortened.trim()) {
      setError('Preencha todos os campos')
      return
    }

    if (!validateShortened(linkShortened)) {
      setError('O link encurtado deve conter apenas letras, números, hífens e underscores')
      return
    }

    const normalizedShortened = linkShortened.startsWith('brev.ly/') 
      ? linkShortened 
      : `brev.ly/${linkShortened.replace(/^brev\.ly\//, '')}`

    const shortenedCode = normalizedShortened.replace(/^brev\.ly\//, '')
    const exists = existingLinks.some(link => {
      const existingCode = link.shortened.replace(/^brev\.ly\//, '')
      return existingCode.toLowerCase() === shortenedCode.toLowerCase()
    })

    if (exists) {
      setError('Este link encurtado já existe. Escolha outro.')
      return
    }

    try {
      const originalUrl = linkOriginal.trim().startsWith('http') 
        ? linkOriginal.trim() 
        : `https://${linkOriginal.trim()}`

      const response = await api.createLink({
        originalUrl,
        shortenedUrl: normalizedShortened,
      })

      const novoLink: Link = {
        id: response.id,
        original: response.originalUrl,
        shortened: `brev.ly/${response.shortenedUrl}`,
        accessCount: response.accessCount,
      }

      onAddLink(novoLink)
      
      if (onLinkCreated) {
        onLinkCreated()
      }
      
      setLinkOriginal('')
      setLinkShortened('brev.ly/')
      setError('')
    } catch (error) {
      if (error instanceof Error) {
        if ('status' in error) {
          const apiError = error as { status: number; message: string }
          if (apiError.status === 409) {
            setError('Este link encurtado já existe. Escolha outro.')
          } else if (apiError.status === 400) {
            setError(apiError.message || 'Dados inválidos. Verifique os campos.')
          } else {
            setError('Erro ao criar link. Tente novamente.')
          }
        } else {
          setError(error.message || 'Erro ao criar link. Tente novamente.')
        }
      } else {
        setError('Erro ao criar link. Tente novamente.')
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Novo link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="link-original" 
            className="block text-sm font-semibold text-gray-400 mb-2"
          >
            LINK ORIGINAL
          </label>
          <input
            id="link-original"
            type="text"
            value={linkOriginal}
            onChange={(e) => setLinkOriginal(e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="www.exemplo.com.br"
          />
        </div>

        <div>
          <label 
            htmlFor="link-encurtado" 
            className="block text-sm font-semibold text-gray-400 mb-2"
          >
            LINK ENCURTADO
          </label>
          <input
            id="link-encurtado"
            type="text"
            value={linkShortened}
            onChange={(e) => setLinkShortened(e.target.value)}
            className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="brev.ly/"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200"
        >
          Salvar link
        </button>
      </form>
    </div>
  )
}

