import fs from 'fs'
import path from 'path'
import { prisma } from './prisma'

export class CleanupService {
  private tempDir: string
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.tempDir = process.env.TEMP_DIR || './temp'
  }

  public startCleanup() {
    console.log('🧹 Otomatik temizlik servisi başlatılıyor...')
    
    
    this.cleanupInterval = setInterval(async () => {
      await this.cleanupOldFiles()
    }, 60 * 60 * 1000) 

    
    this.cleanupOldFiles()
  }

  public stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
      console.log('🛑 Otomatik temizlik servisi durduruldu')
    }
  }

  private async cleanupOldFiles() {
    try {
      console.log('🧹 Eski dosyalar temizleniyor...')
      
      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

      
      const oldDownloads = await prisma.download.findMany({
        where: {
          createdAt: {
            lt: twentyFourHoursAgo
          },
          status: 'COMPLETED',
          filePath: {
            not: null
          }
        }
      })

      console.log(`📊 ${oldDownloads.length} eski dosya bulundu`)

      let deletedCount = 0
      let errorCount = 0

      for (const download of oldDownloads) {
        try {
          
          if (download.filePath && fs.existsSync(download.filePath)) {
            fs.unlinkSync(download.filePath)
            console.log(`🗑️ Dosya silindi: ${download.fileName}`)
            deletedCount++
          }

          
          await prisma.download.delete({
            where: { id: download.id }
          })

        } catch (error) {
          console.error(`❌ Dosya silinemedi: ${download.fileName}`, error)
          errorCount++
        }
      }

      
      await this.cleanupTempDirectory()

      console.log(`✅ Temizlik tamamlandı:`)
      console.log(`   🗑️ Silinen dosya: ${deletedCount}`)
      console.log(`   ❌ Hata: ${errorCount}`)

    } catch (error) {
      console.error('❌ Temizlik servisi hatası:', error)
    }
  }

  private async cleanupTempDirectory() {
    try {
      if (!fs.existsSync(this.tempDir)) {
        return
      }

      const files = fs.readdirSync(this.tempDir)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000 

      for (const file of files) {
        const filePath = path.join(this.tempDir, file)
        const stats = fs.statSync(filePath)

        
        if (now - stats.mtime.getTime() > twentyFourHours) {
          try {
            fs.unlinkSync(filePath)
            console.log(`🗑️ Temp dosya silindi: ${file}`)
          } catch (error) {
            console.error(`❌ Temp dosya silinemedi: ${file}`, error)
          }
        }
      }
    } catch (error) {
      console.error('❌ Temp klasör temizlik hatası:', error)
    }
  }

  
  public async manualCleanup() {
    console.log('🧹 Manuel temizlik başlatılıyor...')
    await this.cleanupOldFiles()
  }
}


let cleanupService: CleanupService | null = null

export function getCleanupService(): CleanupService {
  if (!cleanupService) {
    cleanupService = new CleanupService()
  }
  return cleanupService
}
