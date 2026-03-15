import { useToast } from '../hooks/useToast';

const colors = {
  info: 'border-sky-500/50 bg-sky-500/20',
  success: 'border-emerald-500/50 bg-emerald-500/20',
  error: 'border-red-500/50 bg-red-500/20',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[toast.type]} backdrop-blur-md text-sm text-white/90 shadow-lg cursor-pointer transition-all duration-300`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
