'use client'

import { motion } from 'framer-motion'

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 pt-8 space-y-8">
        {/* User message */}
        <div className="flex justify-end">
          <div className="w-[55%] h-10 rounded-2xl rounded-br-md bg-[var(--bg-soft)]" />
        </div>
        {/* Assistant message */}
        <div className="flex gap-3.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-soft)] shrink-0 mt-1" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[92%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[78%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[65%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[45%]" />
          </div>
        </div>
        {/* Another pair */}
        <div className="flex justify-end">
          <div className="w-[40%] h-10 rounded-2xl rounded-br-md bg-[var(--bg-soft)]" />
        </div>
        <div className="flex gap-3.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-soft)] shrink-0 mt-1" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[88%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[72%]" />
            <div className="h-4 bg-[var(--bg-soft)] rounded w-[58%]" />
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
