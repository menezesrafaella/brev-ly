import type { Link } from '../types'

interface MyLinksProps {
  links: Link[]
}

export default function Links({ links }: MyLinksProps) {
  const handleLinkClick = (link: Link) => {
    const originalUrl = link.original.startsWith('http') 
      ? link.original 
      : `https://${link.original}`
    
    const redirectUrl = `${window.location.origin}${window.location.pathname}?redirect=${encodeURIComponent(originalUrl)}`
    window.open(redirectUrl, '_blank')
  }

  const downloadCSV = () => {
    if (links.length === 0) return

    const headers = ['Link Original', 'Link Encurtado']
    const rows = links.map(link => [
      link.original,
      link.shortened
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'meus-links.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-6 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">Meus links</h2>
        {links.length > 0 && (
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            <svg
              className="w-2 h-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Baixar CSV
          </button>
        )}
      </div>

      {links.length === 0 ? (
        <div 
          className="flex flex-col items-center justify-center flex-1 h-[234px]"
        >
          <div className="w-8 h-8 text-gray-400 mb-3">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium text-center max-w-full px-4">
            AINDA NÃO EXISTEM LINKS CADASTRADOS
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Original:</span> {link.original}
                  </p>
                  <p className="text-sm font-medium">
                    <span className="font-semibold text-gray-600">shortened:</span>{' '}
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {link.shortened}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

