'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Code2, Loader2, X, ArrowRight } from 'lucide-react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { useI18n } from '@/lib/i18n'

type Status = 'loading' | 'login' | 'confirm' | 'success' | 'error' | 'expired'

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
        setStatus('confirm')
        const userRes = await fetch('/api/user')
        const userData = await userRes.json()
        if (userData?.user) setUserName(userData.user.name || userData.user.email)
      } else {
        const data = await res.json()
        setLoginError(data.error || 'Email ou mot de passe incorrect')
      }
    } catch { setLoginError('Erreur réseau') }
    setLoginLoading(false)
  }

  const handleConfirm = async () => {
    setStatus('loading')
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-orb rounded-full -z-10" />
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] -z-10" style={{ backgroundImage: 'radial-gradient(var(--fg) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px]"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 18V6h2.5l7 9.5V6H18v12h-2.5l-7-9.5V18H6z" fill="white"/></svg>
          </div>
          <div className="w-6 flex items-center justify-center">
            <div className="w-4 h-[1px] bg-[var(--border-strong)]" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center">
            <Code2 size={18} className="text-[var(--fg-muted)]" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-[22px] font-bold tracking-[-0.02em] mb-1">{v.title || 'Netral Code'}</h1>
          <p className="text-[13px] text-[var(--fg-muted)]">{v.subtitle || 'Connect your IDE'}</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 shadow-colored">
          {status === 'loading' && (
            <div className="py-10 flex flex-col items-center gap-3">
              <Loader2 size={24} className="animate-spin text-[var(--fg-muted)]" />
              <p className="text-[13px] text-[var(--fg-muted)]">Vérification...</p>
            </div>
          )}

          {status === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[var(--fg-muted)] mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--fg-muted)] mb-1.5 block">{v.loginRequired ? 'Password' : 'Mot de passe'}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--border-strong)] focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all" />
              </div>
              {loginError && <p className="text-[12px] text-red-500">{loginError}</p>}
              <button type="submit" disabled={loginLoading} className="w-full h-11 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                {loginLoading ? <Loader2 size={14} className="animate-spin" /> : <><span>{t.chat?.signIn || 'Sign in'}</span><ArrowRight size={14} /></>}
              </button>
            </form>
          )}

          {status === 'confirm' && (
            <div className="py-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
                  {userName[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-medium">{userName}</p>
                  <p className="text-[11px] text-[var(--fg-muted)]">Netral</p>
                </div>
                <Check size={14} className="text-emerald-500 ml-auto" />
              </div>
              <p className="text-[13px] text-[var(--fg-muted)] mb-5 text-center">{v.confirmDesc || 'Allow Netral Code to access your account?'}</p>
              <button onClick={handleConfirm} className="w-full h-11 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98]">{v.authorize || 'Authorize'}</button>
              <p className="text-[11px] text-[var(--fg-subtle)] mt-3 text-center">{v.tokenNote || ''}</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Check size={28} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <h2 className="text-[18px] font-bold mb-1">{v.success || 'Connected!'}</h2>
                <p className="text-[13px] text-[var(--fg-muted)]">{v.successDesc || 'Go back to VS Code.'}</p>
              </div>
            </motion.div>
          )}

          {status === 'expired' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <X size={28} className="text-amber-500" />
              </div>
              <div className="text-center">
                <h2 className="text-[16px] font-bold mb-1">{v.expired || 'Expired'}</h2>
                <p className="text-[13px] text-[var(--fg-muted)]">{v.expiredDesc || 'Try again.'}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <X size={28} className="text-red-500" />
              </div>
              <div className="text-center">
                <h2 className="text-[16px] font-bold mb-1">{v.error || 'Error'}</h2>
                <p className="text-[13px] text-[var(--fg-muted)]">{error}</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-[var(--fg-subtle)] text-center mt-5">
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
