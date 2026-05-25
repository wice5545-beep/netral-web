'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Code2, Loader2, X, ArrowRight, Shield, Zap, Terminal, Clock } from 'lucide-react'

type Status = 'loading' | 'login' | 'confirm' | 'authorizing' | 'success' | 'error' | 'expired'

function VSCodeAuthContent() {
  const params = useSearchParams()
  const code = params.get('code')
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [userName, setUserName] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 min

  useEffect(() => {
    if (!code) { setStatus('error'); setError('Code manquant. Relancez /login dans VS Code.'); return }
    fetch('/api/user').then(r => {
      if (!r.ok) { setStatus('login'); return null }
      return r.json()
    }).then(d => {
      if (d?.user) { setStatus('confirm'); setUserName(d.user.name || d.user.email) }
    }).catch(() => setStatus('login'))
  }, [code])

  // Countdown timer
  useEffect(() => {
    if (status === 'login' || status === 'confirm') {
      const interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(interval); setStatus('expired'); return 0 }
          return t - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [status])

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
    setLoginLoading(true)
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
    setLoginLoading(false)
  }

  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/[0.02] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative"
      >
        {/* Device code header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 18V6h2.5l7 9.5V6H18v12h-2.5l-7-9.5V18H6z" fill="white"/></svg>
            </div>
            <div>
              <p className="text-[14px] font-bold text-[var(--fg)]">Netral Code</p>
              <p className="text-[11px] text-[var(--fg-muted)]">Liaison IDE</p>
            </div>
          </div>
          {(status === 'login' || status === 'confirm') && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] text-[11px] text-[var(--fg-muted)]">
              <Clock size={10} />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Device code display */}
        {code && status !== 'success' && status !== 'error' && status !== 'expired' && (
          <div className="mb-5 p-3 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] flex items-center gap-3">
            <Terminal size={14} className="text-[var(--fg-muted)] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-[var(--fg-subtle)] uppercase tracking-wider font-semibold mb-0.5">Device Code</p>
              <p className="text-[13px] font-mono font-bold text-[var(--fg)] tracking-wide">{code.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        )}

        {/* Main card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-xl shadow-black/10">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 flex flex-col items-center gap-3">
                <Loader2 size={20} className="animate-spin text-blue-500" />
                <p className="text-[12px] text-[var(--fg-muted)]">Vérification de la session...</p>
              </motion.div>
            )}

            {status === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                <div className="text-center mb-5">
                  <h2 className="text-[17px] font-bold text-[var(--fg)] mb-1">Connexion</h2>
                  <p className="text-[12px] text-[var(--fg-muted)]">Identifiez-vous pour autoriser VS Code</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--fg-muted)] mb-1 block">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@email.com" required autoFocus className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--fg-muted)] mb-1 block">Mot de passe</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full h-10 px-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                  </div>
                  {loginError && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 text-[11px] text-red-400">
                      <X size={12} className="shrink-0" />{loginError}
                    </div>
                  )}
                  <button type="submit" disabled={loginLoading} className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[13px] font-semibold hover:from-blue-600 hover:to-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                    {loginLoading ? <Loader2 size={14} className="animate-spin" /> : <><span>Connecter et autoriser</span><ArrowRight size={14} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {status === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                <div className="text-center mb-5">
                  <h2 className="text-[17px] font-bold text-[var(--fg)] mb-1">Autoriser l&apos;accès</h2>
                  <p className="text-[12px] text-[var(--fg-muted)]">Netral Code demande accès à votre compte</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] mb-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                    {userName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[var(--fg)]">{userName}</p>
                    <p className="text-[10px] text-[var(--fg-muted)]">Compte Netral</p>
                  </div>
                  <Check size={14} className="text-green-500" />
                </div>
                <div className="space-y-2 mb-5 px-1">
                  <div className="flex items-center gap-2.5 text-[11px] text-[var(--fg-muted)]">
                    <Shield size={12} className="text-blue-400" /><span>Accès au quota de messages</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-[var(--fg-muted)]">
                    <Zap size={12} className="text-amber-400" /><span>Exécution de code dans VS Code</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-[var(--fg-muted)]">
                    <Code2 size={12} className="text-purple-400" /><span>Lecture/écriture de fichiers</span>
                  </div>
                </div>
                <button onClick={doAuthorize} className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[13px] font-semibold hover:from-blue-600 hover:to-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                  <Shield size={14} /><span>Autoriser</span>
                </button>
                <p className="text-[10px] text-[var(--fg-subtle)] mt-3 text-center">Token API créé · Révocable dans les paramètres</p>
              </motion.div>
            )}

            {status === 'authorizing' && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 flex flex-col items-center gap-3">
                <div className="relative">
                  <Loader2 size={20} className="animate-spin text-blue-500" />
                  <div className="absolute inset-0 animate-ping opacity-20"><Loader2 size={20} className="text-blue-500" /></div>
                </div>
                <p className="text-[12px] text-[var(--fg-muted)]">Génération du token sécurisé...</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center ring-4 ring-green-500/5">
                  <Check size={24} className="text-green-500" />
                </div>
                <div className="text-center">
                  <h2 className="text-[16px] font-bold text-[var(--fg)] mb-1">Connecté</h2>
                  <p className="text-[12px] text-[var(--fg-muted)]">Retournez dans VS Code — l&apos;extension est prête.</p>
                </div>
                <div className="mt-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 text-[10px] text-green-400 font-medium">
                  Vous pouvez fermer cette page
                </div>
              </motion.div>
            )}

            {status === 'expired' && (
              <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock size={24} className="text-amber-500" />
                </div>
                <div className="text-center">
                  <h2 className="text-[15px] font-bold text-[var(--fg)] mb-1">Code expiré</h2>
                  <p className="text-[12px] text-[var(--fg-muted)]">Tapez <code className="px-1.5 py-0.5 rounded bg-[var(--bg-soft)] text-[11px] font-mono">/login</code> dans VS Code pour réessayer.</p>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X size={24} className="text-red-500" />
                </div>
                <div className="text-center">
                  <h2 className="text-[15px] font-bold text-[var(--fg)] mb-1">Erreur</h2>
                  <p className="text-[12px] text-[var(--fg-muted)]">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-[var(--fg-subtle)] text-center mt-4">
          netral.app · Connexion sécurisée chiffrée
        </p>
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
