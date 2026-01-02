import { useState } from 'react'
import type { Link } from '../types'

interface NewLinkProps {
  onAddLink: (link: Link) => void
}

export default function NewLink({ onAddLink }: NewLinkProps) {
  const [linkOriginal, setLinkOriginal] = useState('')
  const [linkShortened, setLinkShortened] = useState('brev.ly/')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!linkOriginal.trim() || !linkShortened.trim()) {
      return
    }

    const novoLink: Link = {
      id: Date.now().toString(),
      original: linkOriginal,
        shortened: linkShortened.startsWith('brev.ly/') 
        ? linkShortened 
        : `brev.ly/${linkShortened}`,
    }

    onAddLink(novoLink)
    
    setLinkOriginal('')
    setLinkShortened('brev.ly/')
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

