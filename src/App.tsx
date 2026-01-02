import { useState } from 'react'
import Logo from './assets/Logo.svg'
import NewLink from './components/Links'
import Links from './components/NewLink'
import NotFound from './components/NotFound'
import Redirect from './components/Redirect'
import type { Link } from './types'

export default function App() {
  const [links, setLinks] = useState<Link[]>([])
  
  // Verifica se há um parâmetro de redirect na URL
  const urlParams = new URLSearchParams(window.location.search)
  const redirectParam = urlParams.get('redirect')
  const redirectUrl = redirectParam ? decodeURIComponent(redirectParam) : null
  
  // Verifica se há um link encurtado sendo acessado (via pathname ou query param)
  const pathname = window.location.pathname
  const linkParam = urlParams.get('link')
  const shortenedPath = pathname !== '/' && pathname !== '' ? pathname.slice(1) : null
  const requestedShortened = linkParam || shortenedPath

  const addLink = (link: Link) => {
    setLinks([...links, link])
  }

  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  // Se há um link encurtado sendo acessado, verifica se existe
  if (requestedShortened && !redirectUrl) {
    const foundLink = links.find(link => {
      const shortened = link.shortened.replace('brev.ly/', '').replace('brev.ly', '')
      return shortened === requestedShortened || link.shortened === requestedShortened
    })
    
    if (!foundLink) {
      return <NotFound />
    }
    
    // Se encontrou o link, redireciona
    const originalUrl = foundLink.original.startsWith('http') 
      ? foundLink.original 
      : `https://${foundLink.original}`
    
    return (
      <Redirect 
        redirectUrl={originalUrl}
        onManualRedirect={() => window.location.href = originalUrl}
      />
    )
  }

  // Se há um parâmetro de redirect, mostra a página de redirect
  if (redirectUrl) {
    return (
      <Redirect 
        redirectUrl={redirectUrl}
        onManualRedirect={handleManualRedirect}
      />
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
        <Links onAddLink={addLink} />
        <NewLink links={links} />
      </div>
    </div>
  )
}
