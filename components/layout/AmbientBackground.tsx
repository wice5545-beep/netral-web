'use client'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle gradient blobs */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full opacity-[0.04] dark:opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-[0.03] dark:opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)', filter: 'blur(100px)' }}
      />
    </div>
  )
}
