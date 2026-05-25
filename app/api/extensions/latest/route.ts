// Returns the latest VSIX version info for auto-update
export async function GET() {
  const version = '0.38.0'
  const downloadUrl = `https://netral.gallery.vsassets.io/extensions/netral/netral/${version}/package`
  const marketplaceUrl = 'https://marketplace.visualstudio.com/items?itemName=netral.netral'

  return Response.json({
    version,
    filename: `netral-${version}.vsix`,
    downloadUrl,
    marketplaceUrl,
  })
}
