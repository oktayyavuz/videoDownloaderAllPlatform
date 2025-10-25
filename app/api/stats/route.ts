import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const stats = await prisma.download.groupBy({
      by: ['platform'],
      _count: {
        platform: true,
      },
    })

    const totalDownloads = await prisma.download.count()
    const successfulDownloads = await prisma.download.count({
      where: { status: 'COMPLETED' }
    })
    const failedDownloads = await prisma.download.count({
      where: { status: 'FAILED' }
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayDownloads = await prisma.download.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    const platformStats = stats.map((stat: any) => ({
      platform: stat.platform,
      count: stat._count.platform,
    }))

    return NextResponse.json({
      totalDownloads,
      successfulDownloads,
      failedDownloads,
      todayDownloads,
      platformStats,
      successRate: totalDownloads > 0 ? (successfulDownloads / totalDownloads) * 100 : 0,
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
