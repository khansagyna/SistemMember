import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error'

interface ToastState {
  visible: boolean
  type: ToastType
  message: string
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: 'success',
    message: '',
  })

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ visible: true, type, message })
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }))
  }, [])

  return { toast, showToast, hideToast }
}
