import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const download = await prisma.download.findUnique({
      where: { id: params.id },
    })

    if (!download) {
      return NextResponse.json(
        { error: 'İndirme bulunamadı' },
        { status: 404 }
      )
    }

    if (download.status !== 'COMPLETED' || !download.filePath) {
      return NextResponse.json(
        { error: 'Dosya hazır değil' },
        { status: 404 }
      )
    }

    if (!fs.existsSync(download.filePath)) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 404 }
      )
    }

    const fileBuffer = fs.readFileSync(download.filePath)
    const fileName = download.fileName || 'download'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('File download error:', error)
    return NextResponse.json(
      { error: 'Dosya indirme hatası' },
      { status: 500 }
    )
  }
}
