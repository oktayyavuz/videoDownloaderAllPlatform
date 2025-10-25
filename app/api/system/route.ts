import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Sistem durumu kontrol ediliyor...')
    
    const systemStatus = {
      website: true, 
      bot: false,
      cleanup: false,
      timestamp: new Date().toISOString()
    }

    
    try {
      const botResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bot`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (botResponse.ok) {
        const botData = await botResponse.json()
        systemStatus.bot = botData.botRunning
        console.log(`🤖 Bot durumu: ${botData.botRunning ? 'Çalışıyor' : 'Durmuş'}`)
      }
    } catch (error) {
      console.log('❌ Bot kontrolü başarısız:', error)
    }

    
    try {
      const cleanupResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cleanup`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (cleanupResponse.ok) {
        const cleanupData = await cleanupResponse.json()
        systemStatus.cleanup = cleanupData.status === 'running'
        console.log(`🧹 Cleanup servisi durumu: ${cleanupData.status}`)
      }
    } catch (error) {
      console.log('❌ Cleanup kontrolü başarısız:', error)
    }

    console.log('📊 Sistem durumu:', systemStatus)
    
    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error('❌ Sistem kontrolü hatası:', error)
    return NextResponse.json(
      { error: 'Sistem kontrolü başarısız' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    console.log(`🚀 Sistem başlatma işlemi: ${action}`)

    if (action === 'start-all') {
      const results = {
        bot: false,
        cleanup: false,
        errors: [] as string[]
      }

      
      try {
        console.log('🤖 Bot başlatılıyor...')
        const botResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start' })
        })
        
        if (botResponse.ok) {
          results.bot = true
          console.log('✅ Bot başarıyla başlatıldı')
        } else {
          results.errors.push('Bot başlatılamadı')
        }
      } catch (error) {
        results.errors.push(`Bot hatası: ${error}`)
      }

      
      try {
        console.log('🧹 Cleanup servisi başlatılıyor...')
        const cleanupResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cleanup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start' })
        })
        
        if (cleanupResponse.ok) {
          results.cleanup = true
          console.log('✅ Cleanup servisi başarıyla başlatıldı')
        } else {
          results.errors.push('Cleanup servisi başlatılamadı')
        }
      } catch (error) {
        results.errors.push(`Cleanup hatası: ${error}`)
      }

      console.log('🎯 Sistem başlatma sonuçları:', results)
      
      return NextResponse.json({
        success: results.bot && results.cleanup,
        results: results,
        message: results.errors.length === 0 ? 'Tüm sistemler başarıyla başlatıldı' : 'Bazı sistemler başlatılamadı'
      })
    }

    return NextResponse.json({ error: 'Geçersiz action' }, { status: 400 })
  } catch (error) {
    console.error('❌ Sistem başlatma hatası:', error)
    return NextResponse.json(
      { error: 'Sistem başlatma başarısız' },
      { status: 500 }
    )
  }
}
