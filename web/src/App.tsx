import { useEffect, useState } from 'react'
import Logo from './assets/Logo.svg'
import Links from './components/Links'
import NewLink from './components/NewLink'
import NotFound from './components/NotFound'
import Redirect from './components/Redirect'
import { api } from './services/api'
import type { Link } from './types'
import { adaptLinkResponse, adaptLinksResponse } from './utils/linkAdapter'

export default function App() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  
  const urlParams = new URLSearchParams(window.location.search)
  const redirectParam = urlParams.get('redirect')
  const redirectUrl = redirectParam ? decodeURIComponent(redirectParam) : null
  
  const pathname = window.location.pathname
  const shortenedPath = pathname !== '/' && pathname !== '' ? pathname.slice(1) : null

  useEffect(() => {
    loadLinks()
  }, [])

  const loadLinks = async () => {
    try {
      setLoading(true)
      const response = await api.getLinks({ pageSize: 100 })
      setLinks(adaptLinksResponse(response.links))
    } catch (error) {
      console.error('Erro ao carregar links:', error)
    } finally {
      setLoading(false)
    }
  }

  const addLink = async (link: Link) => {
    const response = await api.createLink({
      originalUrl: link.original,
      shortenedUrl: link.shortened,
    })
    const newLink = adaptLinkResponse(response)
    setLinks([...links, newLink])
  }

  const deleteLink = async (shortenedUrl: string) => {
    try {
      await api.deleteLink(shortenedUrl)
      setLinks(links.filter(link => link.shortened !== shortenedUrl))
    } catch (error) {
      console.error('Erro ao deletar link:', error)
      throw error
    }
  }

  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  if (shortenedPath && !redirectUrl) {
    return <RedirectPage shortenedPath={shortenedPath} />
  }

  if (redirectUrl) {
    return (
      <Redirect 
        redirectUrl={redirectUrl}
        onManualRedirect={handleManualRedirect}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-16">
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Brev.ly" height={24}/>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <NewLink onAddLink={addLink} existingLinks={links} onLinkCreated={loadLinks} />
        <Links links={links} onDeleteLink={deleteLink} onLinkDeleted={loadLinks} />
      </div>
    </div>
  )
}

function RedirectPage({ shortenedPath }: { shortenedPath: string }) {
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)

  useEffect(() => {
    async function handleRedirect() {
      try {
        setLoading(true)
        const link = await api.getLinkByShortened(shortenedPath)
        
        await api.incrementAccess(link.shortenedUrl)
        
        const url = link.originalUrl.startsWith('http') 
          ? link.originalUrl 
          : `https://${link.originalUrl}`
        
        setOriginalUrl(url)
      } catch (error) {
        if (error instanceof Error && 'status' in error && (error as { status: number }).status === 404) {
          setNotFound(true)
        } else {
          console.error('Erro ao buscar link:', error)
          setNotFound(true)
        }
      } finally {
        setLoading(false)
      }
    }

    handleRedirect()
  }, [shortenedPath])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Redirecionando...</div>
      </div>
    )
  }

  if (notFound || !originalUrl) {
    return <NotFound />
  }

  return (
    <Redirect 
      redirectUrl={originalUrl}
      onManualRedirect={() => window.location.href = originalUrl}
    />
  )
}
