import { NextRequest } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

// Returns the latest VSIX version info for auto-update
export async function GET(req: NextRequest) {
  const publicDir = path.join(process.cwd(), 'public')

  // Find all .vsix files and get the latest version
  let files: string[] = []
  try {
    files = fs.readdirSync(publicDir).filter(f => f.startsWith('netral-') && f.endsWith('.vsix'))
  } catch {
    return Response.json({ error: 'No extensions found' }, { status: 404 })
  }

  if (files.length === 0) {
    return Response.json({ error: 'No extensions found' }, { status: 404 })
  }

  // Sort by semver (extract version from filename netral-X.Y.Z.vsix)
  const versions = files.map(f => {
    const match = f.match(/netral-(\d+\.\d+\.\d+)\.vsix/)
    return match ? { file: f, version: match[1] } : null
  }).filter(Boolean) as { file: string; version: string }[]

  versions.sort((a, b) => {
    const [a1, a2, a3] = a.version.split('.').map(Number)
    const [b1, b2, b3] = b.version.split('.').map(Number)
    return b1 - a1 || b2 - a2 || b3 - a3
  })

  const latest = versions[0]
  const baseUrl = req.nextUrl.origin

  return Response.json({
    version: latest.version,
    filename: latest.file,
    downloadUrl: `${baseUrl}/${latest.file}`,
    allVersions: versions.map(v => ({
      version: v.version,
      filename: v.file,
      downloadUrl: `${baseUrl}/${v.file}`,
    })),
  })
}
