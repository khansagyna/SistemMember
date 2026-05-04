import { useGlobalToast } from '../context/ToastContext';

export function useToast() {
  const { showToast } = useGlobalToast();

  // Kita biarkan return-nya mirip agar tidak merusak kode yang sudah ada,
  // tapi sekarang fungsinya sudah tembus ke Global.
  return {
    showToast,
    // Dummy state untuk mencegah error di komponen yang masih destructuring toast
    toast: { visible: false, type: 'success' as const, message: '' },
    hideToast: () => {},
  };
}
