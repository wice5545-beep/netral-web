'use client'

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12.5px] font-medium text-[var(--fg-soft)] mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}
