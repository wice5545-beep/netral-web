'use client'

/**
 * Animated aurora background — 3 morphing color blobs + dotted grid mask.
 * Place inside a `relative overflow-hidden` parent.
 */
export function AuroraBackground({
  intensity = 'normal',
  showGrid = true,
}: {
  intensity?: 'subtle' | 'normal' | 'strong'
  showGrid?: boolean
}) {
  const op =
    intensity === 'subtle' ? 'opacity-[0.35]' : intensity === 'strong' ? 'opacity-[0.85]' : 'opacity-60'

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Aurora blobs */}
      <div className={`absolute inset-0 ${op}`}>
        <div
          className="aurora-blob aurora-1"
          style={{
            top: '-20%',
            left: '-10%',
            width: '60vw',
            height: '60vw',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.55) 0%, rgba(124,58,237,0) 70%)',
          }}
        />
        <div
          className="aurora-blob aurora-2"
          style={{
            top: '10%',
            right: '-15%',
            width: '55vw',
            height: '55vw',
            background:
              'radial-gradient(circle, rgba(236,72,153,0.45) 0%, rgba(236,72,153,0) 70%)',
          }}
        />
        <div
          className="aurora-blob aurora-3"
          style={{
            bottom: '-10%',
            left: '20%',
            width: '50vw',
            height: '50vw',
            background:
              'radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0) 70%)',
          }}
        />
      </div>

      {/* Dotted grid */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(var(--fg) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)',
          }}
        />
      )}
    </div>
  )
}
