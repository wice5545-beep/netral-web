'use client'

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] animate-pulse">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-[72px] h-[72px] rounded-[22px] bg-[var(--bg-soft)] mx-auto" />
          <div className="h-8 w-32 bg-[var(--bg-soft)] rounded mx-auto" />
          <div className="h-4 w-56 bg-[var(--bg-soft)] rounded mx-auto" />
        </div>
      </div>
      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-[var(--bg-soft)] rounded" />
            <div className="h-4 w-64 bg-[var(--bg-soft)] rounded" />
          </div>
          <div className="h-11 w-full bg-[var(--bg-soft)] rounded-xl" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-[var(--bg-soft)] rounded-xl" />
            <div className="h-10 w-full bg-[var(--bg-soft)] rounded-xl" />
          </div>
          <div className="h-11 w-full bg-[var(--bg-soft)] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
