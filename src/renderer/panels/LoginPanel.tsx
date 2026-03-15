import { useState } from 'react';

type LoginPanelProps = {
  onLogin: () => void;
};

export function LoginPanel({ onLogin }: LoginPanelProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitEmail = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 600);
  };

  const handleSubmitOtp = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 600);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-[380px] relative">
        {/* Glass card */}
        <div className="rounded-3xl bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] shadow-2xl shadow-black/30 overflow-hidden">
          {/* Top accent line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

          <div className="px-8 pt-8 pb-9">
            {/* Logo centered */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-14 w-14 grid place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white font-bold text-xl shadow-lg shadow-sky-500/30 mb-4">
                S
              </div>
              <h1 className="text-lg font-bold tracking-tight">Social Life</h1>
            </div>

            {step === 'email' && (
              <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmitEmail(); }}>
                <p className="text-xs text-white/40 text-center mb-1">Entrez votre email pour recevoir un code de connexion</p>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M22 7l-10 6L2 7" /></svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-11 pr-4 py-3.5 text-sm outline-none placeholder:text-white/20 focus:border-sky-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(56,189,248,0.08)] transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 disabled:opacity-40 disabled:hover:from-sky-400 disabled:hover:to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30 transition-all duration-300 hover:translate-y-[-1px] active:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Envoi...
                    </span>
                  ) : 'Recevoir le code'}
                </button>
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[10px] text-white/20 uppercase tracking-widest">ou</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <button type="button" className="rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] py-3 text-xs font-medium text-white/50 hover:text-white/70 transition-all duration-300">
                  Créer un compte
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmitOtp(); }}>
                <div className="text-center mb-1">
                  <p className="text-xs text-white/40">
                    Code envoyé à <span className="text-sky-300">{email}</span>
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-11 h-12 rounded-xl border border-white/[0.08] bg-white/[0.04] text-center text-lg font-mono outline-none focus:border-sky-400/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(56,189,248,0.08)] transition-all duration-300"
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        if (input.value && input.nextElementSibling) {
                          (input.nextElementSibling as HTMLInputElement).focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        const input = e.target as HTMLInputElement;
                        if (e.key === 'Backspace' && !input.value && input.previousElementSibling) {
                          (input.previousElementSibling as HTMLInputElement).focus();
                        }
                      }}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 disabled:opacity-40 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30 transition-all duration-300 hover:translate-y-[-1px] active:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Vérification...
                    </span>
                  ) : 'Se connecter'}
                </button>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" onClick={() => setStep('email')} className="text-white/25 hover:text-white/50 transition-colors">
                    Changer d'email
                  </button>
                  <button type="button" className="text-sky-400/50 hover:text-sky-400 transition-colors">
                    Renvoyer le code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
