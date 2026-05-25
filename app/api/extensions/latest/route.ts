// Returns the latest VSIX version info for auto-update
export async function GET() {
  const version = '0.28.0'
  const baseUrl = 'https://marketplace.visualstudio.com/items?itemName=netral.netral'

  return Response.json({
    version,
    filename: `netral-${version}.vsix`,
    downloadUrl: baseUrl,
    marketplaceUrl: baseUrl,
  })
}
