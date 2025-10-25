import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { downloadMedia } from '@/lib/mediaDownloader'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, mediaType = 'VIDEO', quality = 'best' } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    console.log(`🚀 API İndirme İsteği:`)
    console.log(`   URL: ${url}`)
    console.log(`   Platform: ${body.platform}`)
    console.log(`   Media Type: ${mediaType}`)
    console.log(`   Quality: ${quality}`)

    
    const platform = detectPlatform(url)
    console.log(`🔍 Tespit edilen platform: ${platform}`)

    
    const user = await prisma.user.upsert({
      where: { telegramId: 'web-user' },
      update: {},
      create: {
        telegramId: 'web-user',
        username: 'web-user',
        firstName: 'Web',
        lastName: 'User',
      },
    })

    
    const download = await prisma.download.create({
      data: {
        userId: user.id,
        url: url,
        platform: platform,
        mediaType: mediaType,
        quality: quality,
        status: 'PENDING',
      },
    })

    console.log(`📝 Download kaydı oluşturuldu: ${download.id}`)

    
    console.log(`⬇️ İndirme işlemi başlatılıyor...`)
    
    const options = {
      quality: quality,
      onProgress: async (progress: number) => {
        console.log(`📈 Progress Update: ${progress}%`)
        await prisma.download.update({
          where: { id: download.id },
          data: { progress: progress }
        })
      }
    }

    const result = await downloadMedia(url, platform, options)

    if (result.success) {
      
      await prisma.download.update({
        where: { id: download.id },
        data: {
          status: 'COMPLETED',
          fileName: result.fileName,
          fileSize: result.fileSize,
          filePath: result.filePath,
          mediaType: result.mediaType,
          quality: result.quality,
          thumbnail: result.thumbnail,
          title: result.title,
          duration: result.duration,
          progress: 100,
        },
      })

      console.log(`✅ İndirme başarılı!`)
      console.log(`   Dosya: ${result.fileName}`)
      console.log(`   Boyut: ${result.fileSize} bytes`)

      return NextResponse.json({
        success: true,
        downloadId: download.id,
        fileName: result.fileName,
        fileSize: result.fileSize,
        filePath: result.filePath,
        mediaType: result.mediaType,
        quality: result.quality,
        thumbnail: result.thumbnail,
        title: result.title,
        duration: result.duration,
      })
    } else {
      
      await prisma.download.update({
        where: { id: download.id },
        data: {
          status: 'FAILED',
          error: result.error,
        },
      })

      console.log(`❌ İndirme başarısız: ${result.error}`)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function detectPlatform(url: string): 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'TWITTER' | 'OTHER' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YOUTUBE'
  if (url.includes('tiktok.com')) return 'TIKTOK'
  if (url.includes('instagram.com')) return 'INSTAGRAM'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'TWITTER'
  return 'OTHER'
}
