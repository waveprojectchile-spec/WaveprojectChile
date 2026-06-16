'use client'

import { useState } from 'react'
import { CreditCard } from 'lucide-react'

interface Props {
  plan: string
  monto: number
}

export default function PagarButton({ plan, monto }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePagar() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, monto, titulo: plan.toUpperCase() }),
      })

      const data = await res.json()
      console.log('[PAGAR-BUTTON] Respuesta checkout:', data)

      if (data.init_point) {
        window.open(data.init_point, '_blank')
        setLoading(false)
      } else if (data.error) {
        setError(data.error)
        setLoading(false)
      } else {
        setError('Error inesperado, intenta de nuevo.')
        setLoading(false)
      }
    } catch (err) {
      console.error('[PAGAR-BUTTON] Error:', err)
      setError('Error de conexión, intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handlePagar}
        disabled={loading}
        className="flex items-center justify-center gap-3 mx-auto px-10 py-4 font-black text-sm tracking-[0.2em] uppercase text-black disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        style={{ background: 'linear-gradient(120deg, #C9A84C 0%, #FFD600 50%, #C9A84C 100%)', backgroundSize: '200% auto' }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            PROCESANDO...
          </>
        ) : (
          <>
            <CreditCard size={18} strokeWidth={2.5} />
            PAGAR AHORA
          </>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs font-bold tracking-wide">{error}</p>
      )}
    </div>
  )
}
