import { NextRequest, NextResponse } from 'next/server'
import { getCleanupService } from '@/lib/cleanupService'

let cleanupService: any = null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'start') {
      if (!cleanupService) {
        cleanupService = getCleanupService()
        cleanupService.startCleanup()
        console.log('🧹 Temizlik servisi başlatıldı')
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Temizlik servisi başlatıldı' 
      })
    }

    if (action === 'stop') {
      if (cleanupService) {
        cleanupService.stopCleanup()
        cleanupService = null
        console.log('🛑 Temizlik servisi durduruldu')
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Temizlik servisi durduruldu' 
      })
    }

    if (action === 'cleanup') {
      if (!cleanupService) {
        cleanupService = getCleanupService()
      }
      
      await cleanupService.manualCleanup()
      
      return NextResponse.json({ 
        success: true, 
        message: 'Manuel temizlik tamamlandı' 
      })
    }

    return NextResponse.json({ 
      error: 'Geçersiz action' 
    }, { status: 400 })

  } catch (error) {
    console.error('Cleanup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: cleanupService ? 'running' : 'stopped',
    message: cleanupService ? 'Temizlik servisi çalışıyor' : 'Temizlik servisi durmuş'
  })
}
