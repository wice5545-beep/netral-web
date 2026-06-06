import { NextRequest, NextResponse } from 'next/server'
import { getGeneratedImage } from '@/lib/image-cache'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const image = getGeneratedImage(id)
  if (!image) {
    return NextResponse.json({ error: 'Image expired or not found' }, { status: 404 })
  }

  // Extract base64 data (already stored as raw base64, add prefix)
  const base64Data = image.data.includes(',')
    ? image.data.split(',')[1]
    : image.data

  const buffer = Buffer.from(base64Data, 'base64')

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
      'Content-Disposition': 'inline',
    },
  })
}