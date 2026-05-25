// Returns the latest VSIX version info for auto-update
export async function GET() {
  const version = '0.38.0'

  return Response.json({
    version,
    filename: `netral-${version}.vsix`,
    downloadUrl: `https://github.com/wice5545-beep/netral-web/releases/download/v${version}/netral-${version}.vsix`,
    marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=netral.netral',
  })
}
