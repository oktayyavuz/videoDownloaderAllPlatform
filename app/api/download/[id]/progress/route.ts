import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const download = await prisma.download.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        status: true,
        progress: true,
        fileName: true,
        fileSize: true,
        quality: true,
        thumbnail: true,
        title: true,
        duration: true,
        error: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!download) {
      return NextResponse.json(
        { error: 'İndirme bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(download)
  } catch (error) {
    console.error('Download progress error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
