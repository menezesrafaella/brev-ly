import { useState } from 'react'
import Logo from './assets/Logo.svg'
import Links from './components/Links'
import NewLink from './components/NewLink'
import NotFound from './components/NotFound'
import Redirect from './components/Redirect'
import type { Link } from './types'

export default function App() {
  const [links, setLinks] = useState<Link[]>([])
  
  const urlParams = new URLSearchParams(window.location.search)
  const redirectParam = urlParams.get('redirect')
  const redirectUrl = redirectParam ? decodeURIComponent(redirectParam) : null
  
  const pathname = window.location.pathname
  const shortenedPath = pathname !== '/' && pathname !== '' ? pathname.slice(1) : null

  const addLink = (link: Link) => {
    setLinks([...links, link])
  }

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id))
  }

  const incrementAccessCount = (shortened: string) => {
    setLinks(links.map(link => {
      const linkCode = link.shortened.replace(/^brev\.ly\//, '')
      const requestedCode = shortened.replace(/^brev\.ly\//, '')
      if (linkCode.toLowerCase() === requestedCode.toLowerCase() || link.shortened === shortened) {
        return { ...link, accessCount: link.accessCount + 1 }
      }
      return link
    }))
  }

  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  if (shortenedPath && !redirectUrl) {
    const foundLink = links.find(link => {
      const shortened = link.shortened.replace('brev.ly/', '').replace('brev.ly', '').trim()
      return shortened.toLowerCase() === shortenedPath.toLowerCase() || 
             link.shortened.toLowerCase() === shortenedPath.toLowerCase()
    })
    
    if (!foundLink) {
      return <NotFound />
    }
    
    incrementAccessCount(foundLink.shortened)
    
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
        <NewLink onAddLink={addLink} existingLinks={links} />
        <Links links={links} onDeleteLink={deleteLink} />
      </div>
    </div>
  )
}
