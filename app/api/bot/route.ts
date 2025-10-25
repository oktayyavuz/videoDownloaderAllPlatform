import { NextRequest, NextResponse } from 'next/server'
import { startTelegramBot, stopTelegramBot, isBotRunning } from '@/lib/botManager'

export async function GET(request: NextRequest) {
  try {
    const status = isBotRunning()
    
    return NextResponse.json({
      botRunning: status,
      message: status ? 'Bot çalışıyor' : 'Bot durmuş',
    })
  } catch (error) {
    console.error('Bot status error:', error)
    return NextResponse.json(
      { error: 'Bot durumu alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'start') {
      await startTelegramBot()
      return NextResponse.json({
        success: true,
        message: 'Bot başlatıldı',
      })
    } else if (action === 'stop') {
      await stopTelegramBot()
      return NextResponse.json({
        success: true,
        message: 'Bot durduruldu',
      })
    } else {
      return NextResponse.json(
        { error: 'Geçersiz aksiyon' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Bot control error:', error)
    return NextResponse.json(
      { error: 'Bot kontrolü başarısız' },
      { status: 500 }
    )
  }
}
