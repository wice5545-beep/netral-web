'use client'

export default function ChatLoading() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Messages area skeleton */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 pt-8 space-y-6">
        {/* User message skeleton */}
        <div className="flex justify-end">
          <div className="w-[60%] h-10 rounded-2xl rounded-br-md bg-[var(--bg-soft)]" />
        </div>
        {/* Assistant message skeleton */}
        <div className="flex gap-3.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-soft)] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[90%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[75%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[60%]" />
          </div>
        </div>
        {/* Another user message */}
        <div className="flex justify-end">
          <div className="w-[45%] h-10 rounded-2xl rounded-br-md bg-[var(--bg-soft)]" />
        </div>
        {/* Another assistant message */}
        <div className="flex gap-3.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-soft)] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[85%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[70%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[55%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[40%]" />
          </div>
        </div>
      </div>

      {/* Composer skeleton */}
      <div className="max-w-3xl mx-auto w-full px-4 md:px-6 pb-6 pt-4">
        <div className="h-[52px] rounded-2xl bg-[var(--bg-soft)] border border-[var(--border)]" />
      </div>
    </div>
  )
}
