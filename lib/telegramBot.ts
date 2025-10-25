import TelegramBot from 'node-telegram-bot-api'
import { prisma } from './prisma'
import { downloadMedia, DownloadResult } from './mediaDownloader'

interface DownloadProgress {
  downloadId: string
  messageId: number
  lastUpdate: number
  progress: number
}

class TelegramBotService {
  private bot: TelegramBot
  private isRunning: boolean = false
  private downloadProgress: Map<string, DownloadProgress> = new Map()

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is required')
    }
    
    this.bot = new TelegramBot(token, { polling: true })
    this.setupHandlers()
  }

  private setupHandlers() {
    
    this.bot.onText(/\/start/, async (msg: any) => {
      const chatId = msg.chat.id
      const userId = msg.from?.id.toString()
      
      try {
        
        await prisma.user.upsert({
          where: { telegramId: userId },
          update: {
            username: msg.from?.username,
            firstName: msg.from?.first_name,
            lastName: msg.from?.last_name,
          },
          create: {
            telegramId: userId,
            username: msg.from?.username,
            firstName: msg.from?.first_name,
            lastName: msg.from?.last_name,
          },
        })

        
        await prisma.botSession.upsert({
          where: { chatId: chatId.toString() },
          update: { isActive: true },
          create: {
            chatId: chatId.toString(),
            userId: userId,
            isActive: true,
          },
        })

        const welcomeMessage = `
🤖 *RimuruTR Bot'a Hoş Geldiniz!*

Bu bot ile YouTube, TikTok, Instagram ve Twitter'dan medya indirebilirsiniz.

📋 *Kullanım:*
• Sadece link gönderin
• Bot otomatik olarak platformu tespit eder
• Kalite seçimi yapın
• İndirme işlemi başlar

🔗 *Desteklenen Platformlar:*
• YouTube (Video/Audio)
• TikTok (Video)
• Instagram (Post/Video/Reel)
• Twitter (Video/Tweet)

💡 *Komutlar:*
/start - Botu başlat
/help - Yardım
/status - Bot durumu
        `

        await this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' })
      } catch (error) {
        console.error('Error in start command:', error)
        await this.bot.sendMessage(chatId, 'Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    })

    
    this.bot.onText(/\/help/, async (msg: any) => {
      const chatId = msg.chat.id
      const helpMessage = `
📖 *Yardım*

Bu bot sosyal medya platformlarından medya indirmenizi sağlar.

🔗 *Nasıl Kullanılır:*
1. İndirmek istediğiniz içeriğin linkini kopyalayın
2. Linki bu sohbete gönderin
3. Kalite seçimi yapın
4. Bot otomatik olarak indirme işlemini başlatır

⚡ *Desteklenen Formatlar:*
• Video (MP4)
• Ses (MP3)
• Resim (JPG, PNG)

⏱️ *İndirme Süresi:*
• Küçük dosyalar: 10-30 saniye
• Büyük dosyalar: 1-5 dakika

❓ *Sorun mu yaşıyorsunuz?*
/status komutu ile bot durumunu kontrol edebilirsiniz.
      `
      await this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' })
    })

    
    this.bot.onText(/\/status/, async (msg: any) => {
      const chatId = msg.chat.id
      const statusMessage = `
🤖 *Bot Durumu*

✅ Bot Aktif
🔄 İndirme Servisi: Çalışıyor
📊 Veritabanı: Bağlı

💾 *Son İstatistikler:*
• Toplam İndirme: ${await this.getTotalDownloads()}
• Başarılı İndirme: ${await this.getSuccessfulDownloads()}
• Bugünkü İndirme: ${await this.getTodayDownloads()}
      `
      await this.bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' })
    })

    
    this.bot.on('message', async (msg: any) => {
      if (msg.text && this.isValidUrl(msg.text)) {
        await this.handleUrlMessage(msg)
      }
    })

    
    this.bot.on('callback_query', async (callbackQuery: any) => {
      const chatId = callbackQuery.message.chat.id
      const data = callbackQuery.data
      const messageId = callbackQuery.message.message_id

      try {
        if (data.startsWith('quality_')) {
          const [_, downloadId, quality] = data.split('_')
          await this.handleQualitySelection(chatId, messageId, downloadId, quality)
        }
      } catch (error) {
        console.error('Callback query error:', error)
        await (this.bot as any).answerCallbackQuery(callbackQuery.id, 'Bir hata oluştu')
      }
    })

    
    this.bot.on('error', (error: any) => {
      console.error('Telegram Bot Error:', error)
    })

    this.bot.on('polling_error', (error: any) => {
      console.error('Telegram Bot Polling Error:', error)
    })
  }

  private async handleQualitySelection(chatId: number, messageId: number, downloadId: string, quality: string) {
    try {
      console.log(`🤖 Telegram Bot - Kalite Seçimi:`)
      console.log(`   Chat ID: ${chatId}`)
      console.log(`   Download ID: ${downloadId}`)
      console.log(`   Quality: ${quality}`)

      
      const download = await prisma.download.findUnique({
        where: { id: downloadId }
      })

      if (!download) {
        console.log(`❌ Download kaydı bulunamadı: ${downloadId}`)
        await this.bot.sendMessage(chatId, '❌ İndirme kaydı bulunamadı')
        return
      }

      
      let mediaType = 'VIDEO'
      let qualityOption = quality

      if (quality === 'audio') {
        mediaType = 'AUDIO'
        qualityOption = 'best'
      }

      console.log(`📝 Download güncelleniyor: ${mediaType} - ${qualityOption}`)

      
      await prisma.download.update({
        where: { id: downloadId },
        data: {
          status: 'PROCESSING',
          mediaType: mediaType,
          quality: qualityOption,
        },
      })

      
      const processingMsg = await this.bot.sendMessage(chatId, '🔄 İndirme işlemi başlatılıyor...')

      
      this.downloadProgress.set(downloadId, {
        downloadId,
        messageId: processingMsg.message_id,
        lastUpdate: Date.now(),
        progress: 0
      })

      console.log(`⬇️ Telegram Bot indirme başlatılıyor...`)
      
      const result = await this.downloadWithProgress(chatId, downloadId, download.url, download.platform, mediaType, qualityOption)
      
      
      this.downloadProgress.delete(downloadId)

      if (result.success) {
        
        await prisma.download.update({
          where: { id: downloadId },
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

        
        const caption = `✅ *İndirme Tamamlandı!*

📁 **Dosya:** ${result.fileName}
📊 **Boyut:** ${this.formatFileSize(result.fileSize)}
🎬 **Kalite:** ${result.quality}
${result.title ? `📺 **Başlık:** ${result.title}` : ''}
${result.duration ? `⏱️ **Süre:** ${this.formatDuration(result.duration)}` : ''}`

        if (result.thumbnail) {
          
          await (this.bot as any).sendPhoto(chatId, result.thumbnail, {
            caption: caption,
            parse_mode: 'Markdown'
          })
        }

        
        await this.bot.sendDocument(chatId, result.filePath!, {
          caption: '📎 Dosya hazır!'
        })

        
        await this.bot.editMessageText('✅ İndirme başarıyla tamamlandı!', {
          chat_id: chatId,
          message_id: processingMsg.message_id,
        })
      } else {
        
        await prisma.download.update({
          where: { id: downloadId },
          data: {
            status: 'FAILED',
            error: result.error,
          },
        })

        
        await this.bot.editMessageText(`❌ İndirme başarısız: ${result.error}`, {
          chat_id: chatId,
          message_id: processingMsg.message_id,
        })
      }

      
      try {
        await (this.bot as any).answerCallbackQuery('', { text: 'İndirme başlatıldı!' })
      } catch (error) {
        
        console.log('⚠️ Callback query timeout (normal for long downloads)')
      }

    } catch (error) {
      console.error('Error handling quality selection:', error)
      await this.bot.sendMessage(chatId, '❌ Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  private async downloadWithProgress(chatId: number, downloadId: string, url: string, platform: string, mediaType: string, quality: string): Promise<DownloadResult> {
    return new Promise(async (resolve) => {
      try {
        console.log(`🔄 Telegram Bot Progress Tracking başlatılıyor:`)
        console.log(`   URL: ${url}`)
        console.log(`   Platform: ${platform}`)
        console.log(`   Media Type: ${mediaType}`)
        console.log(`   Quality: ${quality}`)

        const options = {
          quality: quality,
          onProgress: async (progress: number) => {
            const progressData = this.downloadProgress.get(downloadId)
            if (progressData && Date.now() - progressData.lastUpdate > 2000) { 
              try {
                console.log(`📈 Telegram Progress Update: ${progress}%`)
                await this.bot.editMessageText(`🔄 İndiriliyor... ${progress}%`, {
                  chat_id: chatId,
                  message_id: progressData.messageId,
                })
                
                
                await prisma.download.update({
                  where: { id: downloadId },
                  data: { progress: progress }
                })

                progressData.lastUpdate = Date.now()
                progressData.progress = progress
              } catch (error) {
                console.error('Progress update error:', error)
              }
            }
          }
        }

        let result: DownloadResult
        if (mediaType === 'AUDIO') {
          console.log(`🎵 Ses indirme başlatılıyor...`)
          result = await downloadMedia(url, platform, options)
          result.mediaType = 'AUDIO'
        } else {
          console.log(`🎬 Video indirme başlatılıyor...`)
          result = await downloadMedia(url, platform, options)
        }

        console.log(`✅ Telegram Bot indirme tamamlandı: ${result.success ? 'Başarılı' : 'Başarısız'}`)
        resolve(result)
      } catch (error) {
        console.error(`❌ Telegram Bot indirme hatası:`, error)
        resolve({
          success: false,
          error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        })
      }
    })
  }

  private async handleUrlMessage(msg: any) {
    const chatId = msg.chat.id
    const url = msg.text!
    const userId = msg.from?.id.toString()

    try {
      
      const platform = this.detectPlatform(url)
      
      
      const user = await prisma.user.upsert({
        where: { telegramId: userId! },
        update: {
          username: msg.from?.username,
          firstName: msg.from?.first_name,
          lastName: msg.from?.last_name,
        },
        create: {
          telegramId: userId!,
          username: msg.from?.username,
          firstName: msg.from?.first_name,
          lastName: msg.from?.last_name,
        },
      })
      
      
      const download = await prisma.download.create({
        data: {
          userId: user.id,
          url: url,
          platform: platform,
          mediaType: 'VIDEO', 
          status: 'PENDING',
        },
      })

      
      const qualityKeyboard = {
        inline_keyboard: [
          [
            { text: '🎬 En İyi Kalite', callback_data: `quality_${download.id}_best` },
            { text: '📺 1080p', callback_data: `quality_${download.id}_1080p` }
          ],
          [
            { text: '📱 720p', callback_data: `quality_${download.id}_720p` },
            { text: '📱 480p', callback_data: `quality_${download.id}_480p` }
          ],
          [
            { text: '🎵 Sadece Ses', callback_data: `quality_${download.id}_audio` }
          ]
        ]
      }

      const qualityMessage = `
🎯 *Kalite Seçimi*

📹 **Video Kaliteleri:**
• En İyi Kalite - Mevcut en yüksek kalite
• 1080p - Full HD kalite
• 720p - HD kalite  
• 480p - Standart kalite

🎵 **Ses:**
• Sadece Ses - MP3 formatında

Lütfen istediğiniz kaliteyi seçin:
      `

      await this.bot.sendMessage(chatId, qualityMessage, {
        parse_mode: 'Markdown',
        reply_markup: qualityKeyboard
      })

    } catch (error) {
      console.error('Error handling URL message:', error)
      await this.bot.sendMessage(chatId, '❌ Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  private isValidUrl(text: string): boolean {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    return urlPattern.test(text)
  }

  private detectPlatform(url: string): 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'TWITTER' | 'OTHER' {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YOUTUBE'
    if (url.includes('tiktok.com')) return 'TIKTOK'
    if (url.includes('instagram.com')) return 'INSTAGRAM'
    if (url.includes('twitter.com') || url.includes('x.com')) return 'TWITTER'
    return 'OTHER'
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
  }

  private formatFileSize(bytes: number | undefined): string {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  private async getTotalDownloads(): Promise<number> {
    return await prisma.download.count()
  }

  private async getSuccessfulDownloads(): Promise<number> {
    return await prisma.download.count({
      where: { status: 'COMPLETED' }
    })
  }

  private async getTodayDownloads(): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return await prisma.download.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })
  }

  public async start() {
    if (this.isRunning) {
      console.log('Bot is already running')
      return
    }

    try {
      console.log('🤖 Telegram Bot başlatılıyor...')
      this.isRunning = true
      console.log('✅ Telegram Bot başarıyla başlatıldı!')
    } catch (error) {
      console.error('❌ Telegram Bot başlatılamadı:', error)
      this.isRunning = false
    }
  }

  public async stop() {
    if (!this.isRunning) {
      console.log('Bot is not running')
      return
    }

    try {
      await this.bot.stopPolling()
      this.isRunning = false
      console.log('🛑 Telegram Bot durduruldu')
    } catch (error) {
      console.error('Error stopping bot:', error)
    }
  }

  public isBotRunning(): boolean {
    return this.isRunning
  }
}

export default TelegramBotService