'use client'

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6 animate-pulse">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="w-14 h-14 rounded-[18px] bg-[var(--bg-soft)] mx-auto" />
        <div className="space-y-3">
          <div className="h-7 w-56 bg-[var(--bg-soft)] rounded mx-auto" />
          <div className="h-4 w-72 bg-[var(--bg-soft)] rounded mx-auto" />
        </div>
        <div className="h-12 w-full bg-[var(--bg-soft)] rounded-xl" />
        <div className="flex justify-center gap-3">
          <div className="h-10 w-24 bg-[var(--bg-soft)] rounded-xl" />
          <div className="h-10 w-24 bg-[var(--bg-soft)] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
