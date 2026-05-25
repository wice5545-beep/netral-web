'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Code2, Loader2, X, ArrowRight, Shield, Zap } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

type Status = 'loading' | 'login' | 'confirm' | 'authorizing' | 'success' | 'error' | 'expired'

function VSCodeAuthContent() {
  const params = useSearchParams()
  const code = params.get('code')
  const { t } = useI18n()
  const v = t.vscodeAuth || {}
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
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

  const doAuthorize = async () => {
    setStatus('authorizing')
    try {
      const res = await fetch('/api/auth/vscode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json()
        if (res.status === 410) setStatus('expired')
        else { setStatus('error'); setError(data.error || 'Erreur de liaison') }
      }
    } catch { setStatus('error'); setError('Erreur réseau. Vérifiez votre connexion.') }
  }

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
        // Auto-authorize after login
        await doAuthorize()
      } else {
        const data = await res.json()
        setLoginError(data.error || 'Email ou mot de passe incorrect')
      }
    } catch { setLoginError('Erreur réseau') }
    setLoginLoading(false)
  }

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-6">
      {['Connexion', 'Autorisation', 'Terminé'].map((label, i) => {
        const stepNum = status === 'login' ? 0 : status === 'confirm' || status === 'authorizing' ? 1 : status === 'success' ? 2 : -1
        const isActive = i === stepNum
        const isDone = i < stepNum
        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && <div className={`w-6 h-[1px] ${isDone ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />}
            <div className={`flex items-center gap-1.5 ${isActive ? 'text-[var(--fg)]' : isDone ? 'text-emerald-500' : 'text-[var(--fg-subtle)]'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : isActive ? 'border-[var(--fg)] text-[var(--fg)]' : 'border-[var(--border)] text-[var(--fg-subtle)]'}`}>
                {isDone ? <Check size={10} /> : i + 1}
              </div>
              <span className="text-[10px] font-medium hidden sm:inline">{label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-orb rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px]"
      >
        {/* Header icons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 18V6h2.5l7 9.5V6H18v12h-2.5l-7-9.5V18H6z" fill="white"/></svg>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)]" />
          </div>
          <div className="w-11 h-11 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center">
            <Code2 size={20} className="text-[var(--fg-muted)]" />
          </div>
        </div>

        <div className="text-center mb-5">
          <h1 className="text-[22px] font-bold tracking-[-0.02em] mb-1">Lier VS Code</h1>
          <p className="text-[13px] text-[var(--fg-muted)]">Connectez Netral Code à votre compte</p>
        </div>

        {/* Step indicator */}
        {status !== 'error' && status !== 'expired' && status !== 'loading' && stepIndicator}

        {/* Card */}
        <div className="glass-card p-6 shadow-colored">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 flex flex-col items-center gap-3">
                <Loader2 size={22} className="animate-spin text-[var(--fg-muted)]" />
                <p className="text-[13px] text-[var(--fg-muted)]">Vérification...</p>
              </motion.div>
            )}

            {status === 'login' && (
              <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} onSubmit={handleLogin} className="space-y-4">
                <p className="text-[12px] text-[var(--fg-muted)] text-center mb-2">Connectez-vous à votre compte Netral</p>
                <div>
                  <label className="text-[11px] font-medium text-[var(--fg-muted)] mb-1.5 block uppercase tracking-wide">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus className="w-full h-10 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[var(--fg-muted)] mb-1.5 block uppercase tracking-wide">Mot de passe</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full h-10 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all" />
                </div>
                {loginError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                    <X size={12} className="text-red-500 shrink-0" />
                    <p className="text-[12px] text-red-500">{loginError}</p>
                  </div>
                )}
                <button type="submit" disabled={loginLoading} className="w-full h-11 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                  {loginLoading ? <Loader2 size={14} className="animate-spin" /> : <><span>Se connecter et autoriser</span><ArrowRight size={14} /></>}
                </button>
              </motion.form>
            )}

            {status === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="py-2">
                <div className="flex items-center gap-3 p-3.5 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] mb-5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
                    {userName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">{userName}</p>
                    <p className="text-[11px] text-[var(--fg-muted)]">Compte Netral</p>
                  </div>
                  <Check size={16} className="text-emerald-500" />
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2.5 text-[12px] text-[var(--fg-muted)]">
                    <Shield size={13} className="text-[var(--fg-subtle)]" />
                    <span>Accès à votre quota de messages</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[12px] text-[var(--fg-muted)]">
                    <Zap size={13} className="text-[var(--fg-subtle)]" />
                    <span>Utilisation de l&apos;AI depuis VS Code</span>
                  </div>
                </div>

                <button onClick={doAuthorize} className="w-full h-11 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  <Shield size={14} />
                  <span>Autoriser Netral Code</span>
                </button>
                <p className="text-[10px] text-[var(--fg-subtle)] mt-3 text-center">Un token API sera créé. Révocable à tout moment.</p>
              </motion.div>
            )}

            {status === 'authorizing' && (
              <motion.div key="authorizing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 flex flex-col items-center gap-3">
                <Loader2 size={22} className="animate-spin text-[var(--fg-muted)]" />
                <p className="text-[13px] text-[var(--fg-muted)]">Autorisation en cours...</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Check size={28} className="text-emerald-500" />
                </div>
                <div className="text-center">
                  <h2 className="text-[18px] font-bold mb-1">Connecté !</h2>
                  <p className="text-[13px] text-[var(--fg-muted)]">Retournez dans VS Code — l&apos;extension est prête.</p>
                </div>
                <p className="text-[11px] text-[var(--fg-subtle)] mt-2">Vous pouvez fermer cette page.</p>
              </motion.div>
            )}

            {status === 'expired' && (
              <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <X size={28} className="text-amber-500" />
                </div>
                <div className="text-center">
                  <h2 className="text-[16px] font-bold mb-1">Code expiré</h2>
                  <p className="text-[13px] text-[var(--fg-muted)]">Le code a expiré (5 min). Tapez <code className="px-1.5 py-0.5 rounded bg-[var(--bg-soft)] text-[12px] font-mono">/login</code> dans VS Code pour réessayer.</p>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <X size={28} className="text-red-500" />
                </div>
                <div className="text-center">
                  <h2 className="text-[16px] font-bold mb-1">Erreur</h2>
                  <p className="text-[13px] text-[var(--fg-muted)]">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[10px] text-[var(--fg-subtle)] text-center mt-5">
          netral.app — Agent IA pour développeurs
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
