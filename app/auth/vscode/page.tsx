'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Code2, Loader2, X, Shield, Zap, Terminal } from 'lucide-react'

type Status = 'loading' | 'login' | 'confirm' | 'authorizing' | 'success' | 'error' | 'expired'

function VSCodeAuthContent() {
  const params = useSearchParams()
  const code = params.get('code')
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (!code) { setStatus('error'); setError('Code manquant. Relancez /login dans VS Code.'); return }
    fetch('/api/user').then(r => {
      if (!r.ok) { setStatus('login'); return null }
      return r.json()
    }).then(d => {
      if (d?.user) { setStatus('confirm'); setUserName(d.user.name || d.user.email) }
    }).catch(() => setStatus('login'))
  }, [code])

  const doAuthorize = useCallback(async () => {
    setStatus('authorizing')
    try {
      const res = await fetch('/api/auth/vscode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (res.ok) setStatus('success')
      else {
        const data = await res.json()
        if (res.status === 410) setStatus('expired')
        else { setStatus('error'); setError(data.error || 'Erreur') }
      }
    } catch { setStatus('error'); setError('Erreur réseau') }
  }, [code])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const userRes = await fetch('/api/user')
        const userData = await userRes.json()
        if (userData?.user) setUserName(userData.user.name || userData.user.email)
        await doAuthorize()
      } else {
        const data = await res.json()
        setLoginError(data.error || 'Identifiants incorrects')
      }
    } catch { setLoginError('Erreur réseau') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[380px]"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 18V6h2.5l7 9.5V6H18v12h-2.5l-7-9.5V18H6z" fill="white"/></svg>
          </div>
          <div className="w-5 flex items-center justify-center"><div className="w-3 h-[1px] bg-[var(--border)]" /></div>
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center">
            <Code2 size={18} className="text-[var(--fg-muted)]" />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-xl shadow-black/5">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 flex flex-col items-center gap-3">
                <Loader2 size={20} className="animate-spin text-[var(--fg-muted)]" />
                <p className="text-[12px] text-[var(--fg-muted)]">Vérification...</p>
              </motion.div>
            )}

            {status === 'login' && (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-[16px] font-bold text-center mb-1">Connexion à Netral</h2>
                <p className="text-[12px] text-[var(--fg-muted)] text-center mb-5">Connectez-vous pour autoriser VS Code</p>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required autoFocus className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] transition-all" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] transition-all" />
                  {loginError && <p className="text-[11px] text-red-500">{loginError}</p>}
                  <button type="submit" disabled={loading} className="w-full h-10 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : 'Se connecter et autoriser'}
                  </button>
                </form>
              </motion.div>
            )}

            {status === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-[16px] font-bold text-center mb-1">Autoriser Netral Code ?</h2>
                <p className="text-[12px] text-[var(--fg-muted)] text-center mb-5">L&apos;extension VS Code demande accès à votre compte</p>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
                    {userName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">{userName}</p>
                    <p className="text-[10px] text-[var(--fg-muted)]">Compte Netral</p>
                  </div>
                </div>

                <div className="space-y-2 mb-5 text-[11px] text-[var(--fg-muted)]">
                  <div className="flex items-center gap-2"><Shield size={12} className="text-emerald-500" />Accès à votre quota de messages</div>
                  <div className="flex items-center gap-2"><Zap size={12} className="text-amber-500" />Exécution de code depuis VS Code</div>
                  <div className="flex items-center gap-2"><Terminal size={12} className="text-purple-400" />Lecture et écriture de fichiers</div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => window.close()} className="flex-1 h-10 rounded-lg border border-[var(--border)] text-[13px] font-medium hover:bg-[var(--bg-soft)] transition-all">Décliner</button>
                  <button onClick={doAuthorize} className="flex-1 h-10 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all">Autoriser</button>
                </div>
              </motion.div>
            )}

            {status === 'authorizing' && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 flex flex-col items-center gap-3">
                <Loader2 size={20} className="animate-spin text-[var(--fg-muted)]" />
                <p className="text-[12px] text-[var(--fg-muted)]">Autorisation en cours...</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div key="ok" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Check size={24} className="text-emerald-500" />
                </div>
                <h2 className="text-[15px] font-bold">Connecté !</h2>
                <p className="text-[12px] text-[var(--fg-muted)]">Retournez dans VS Code.</p>
                <p className="text-[10px] text-[var(--fg-subtle)] mt-1">Vous pouvez fermer cette page.</p>
              </motion.div>
            )}

            {status === 'expired' && (
              <motion.div key="exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center"><X size={24} className="text-amber-500" /></div>
                <h2 className="text-[15px] font-bold">Code expiré</h2>
                <p className="text-[12px] text-[var(--fg-muted)]">Tapez /login dans VS Code pour réessayer.</p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center"><X size={24} className="text-red-500" /></div>
                <h2 className="text-[15px] font-bold">Erreur</h2>
                <p className="text-[12px] text-[var(--fg-muted)]">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default function VSCodeAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg)]"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>}>
      <VSCodeAuthContent />
    </Suspense>
  )
}
