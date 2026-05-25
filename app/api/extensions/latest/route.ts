// Returns the latest VSIX version info - fetches from GitHub Releases
export async function GET() {
  try {
    const res = await fetch('https://api.github.com/repos/wice5545-beep/netral-web/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 60 },
    })
    if (res.ok) {
      const release = await res.json()
      const asset = release.assets?.find((a: any) => a.name.endsWith('.vsix'))
      if (asset) {
        const version = release.tag_name.replace('v', '')
        return Response.json({
          version,
          filename: asset.name,
          downloadUrl: asset.browser_download_url,
          marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=netral.netral',
        })
      }
    }
  } catch {}

  // Fallback
  return Response.json({
    version: '0.39.0',
    filename: 'netral-0.39.0.vsix',
    downloadUrl: 'https://github.com/wice5545-beep/netral-web/releases/download/v0.38.0/netral-0.38.0.vsix',
    marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=netral.netral',
  })
}
