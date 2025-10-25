'use client'

import { useEffect } from 'react'

export default function BotStarter() {
  useEffect(() => {
    
    const checkAndStartSystems = async () => {
      try {
        console.log('🔍 Sistem durumu kontrol ediliyor...')
        
        
        const statusResponse = await fetch('/api/system', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (statusResponse.ok) {
          const status = await statusResponse.json()
          console.log('📊 Sistem durumu:', status)
          
          
          if (!status.bot || !status.cleanup) {
            console.log('🚀 Çalışmayan sistemler başlatılıyor...')
            
            const startResponse = await fetch('/api/system', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'start-all' })
            })
            
            if (startResponse.ok) {
              const result = await startResponse.json()
              console.log('✅ Sistem başlatma sonucu:', result)
              
              if (result.success) {
                console.log('🎉 Tüm sistemler başarıyla başlatıldı!')
              } else {
                console.log('⚠️ Bazı sistemler başlatılamadı:', result.results.errors)
              }
            } else {
              console.error('❌ Sistem başlatma isteği başarısız')
            }
          } else {
            console.log('✅ Tüm sistemler zaten çalışıyor!')
          }
        } else {
          console.error('❌ Sistem durumu kontrol edilemedi')
        }
        
      } catch (error) {
        console.error('❌ Sistem kontrolü hatası:', error)
      }
    }

    
    setTimeout(checkAndStartSystems, 2000)
  }, [])

  return null
}
