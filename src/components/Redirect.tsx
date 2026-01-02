import Icon from '../assets/Logo_Icon.svg'

interface RedirectProps {
  redirectUrl?: string
  onManualRedirect?: () => void
}

export default function Redirect({ redirectUrl, onManualRedirect }: RedirectProps) {
  const handleManualRedirect = () => {
    if (onManualRedirect) {
      onManualRedirect()
    } else if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
         <img src={Icon} alt="Brev.ly" height={48}/>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecionando...
        </h1>

        <p className="text-gray-700 mb-4">
          O link será aberto automaticamente em alguns instantes.
        </p>

        <p className="text-gray-700">
          Não foi redirecionado?
          <button
            onClick={handleManualRedirect}
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            Acesse aqui
          </button>
        </p>
      </div>
    </div>
  )
}

