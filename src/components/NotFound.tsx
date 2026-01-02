import NotFoundImage from '../assets/404.svg'

export default function NotFound() {
  const handleHomeClick = () => {
    window.location.href = window.location.origin + window.location.pathname
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <img 
            src={NotFoundImage} 
            alt="404" 
            className="w-auto h-20"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Link não encontrado
        </h1>

        <p className="text-gray-700 text-sm leading-relaxed">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.{' '}
          <button
            onClick={handleHomeClick}
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            Saiba mais em brev.ly
          </button>
        </p>
      </div>
    </div>
  )
}

