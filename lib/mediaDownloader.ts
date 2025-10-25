import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface DownloadResult {
  success: boolean
  fileName?: string
  fileSize?: number
  filePath?: string
  mediaType?: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'POST'
  error?: string
  progress?: number
  quality?: string
  thumbnail?: string
  title?: string
  duration?: number
}

interface DownloadOptions {
  quality?: string
  onProgress?: (progress: number) => void
}

export class MediaDownloader {
  private tempDir: string

  constructor() {
    this.tempDir = process.env.TEMP_DIR || './temp'
    this.ensureTempDir()
  }

  private ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }

  public async downloadMedia(url: string, platform: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    try {
      switch (platform) {
        case 'YOUTUBE':
          return await this.downloadYouTube(url, options)
        case 'TIKTOK':
          return await this.downloadTikTok(url, options)
        case 'INSTAGRAM':
          return await this.downloadInstagram(url, options)
        case 'TWITTER':
          return await this.downloadTwitter(url, options)
        default:
          return {
            success: false,
            error: 'Desteklenmeyen platform'
          }
      }
    } catch (error) {
      console.error('Download error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    }
  }

  private async downloadYouTube(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    try {
      console.log(`🎬 YouTube indirme başlatılıyor: ${url}`)
      
      
      const infoCommand = `yt-dlp --dump-json "${url}"`
      console.log(`📊 Video bilgileri alınıyor...`)
      const infoResult = await execAsync(infoCommand)
      const videoInfo = JSON.parse(infoResult.stdout)
      
      const title = videoInfo.title || 'Unknown Title'
      const duration = videoInfo.duration || 0
      const thumbnail = videoInfo.thumbnail || videoInfo.thumbnails?.[0]?.url
      
      console.log(`📺 Video: ${title}`)
      console.log(`⏱️ Süre: ${formatDuration(duration)}`)
      console.log(`🖼️ Thumbnail: ${thumbnail ? 'Mevcut' : 'Yok'}`)
      
      
      let qualityOption = ''
      
      
      
      if (options.onProgress) {
        console.log(`📈 Progress: %10`)
        options.onProgress(10)
      }
      
      const fileName = `${title.replace(/[^\w\s-]/g, '').trim()}_${Date.now()}.mp4`
      const filePath = path.join(this.tempDir, fileName)

      const command = `yt-dlp -o "${filePath}" "${url}"`
      console.log(`⬇️ İndirme komutu: ${command}`)
      
      
      if (options.onProgress) {
        console.log(`📈 Progress: %50`)
        options.onProgress(50)
      }
      
      console.log(`🔄 Video indiriliyor...`)
      await execAsync(command)

      
      if (options.onProgress) {
        console.log(`📈 Progress: %90`)
        options.onProgress(90)
      }

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        
        
        if (options.onProgress) {
          console.log(`📈 Progress: %100`)
          options.onProgress(100)
        }
        
        console.log(`✅ İndirme tamamlandı!`)
        console.log(`📁 Dosya: ${fileName}`)
        console.log(`📊 Boyut: ${formatFileSize(stats.size)}`)
        
        return {
          success: true,
          fileName: fileName,
          fileSize: stats.size,
          filePath: filePath,
          mediaType: 'VIDEO',
          quality: options.quality || 'best',
          thumbnail: thumbnail,
          title: title,
          duration: duration
        }
      } else {
        console.log(`❌ Dosya oluşturulamadı: ${filePath}`)
        return {
          success: false,
          error: 'YouTube video indirilemedi'
        }
      }
    } catch (error) {
      console.error(`❌ YouTube indirme hatası:`, error)
      return {
        success: false,
        error: `YouTube indirme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      }
    }
  }

  private async downloadTikTok(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    try {
      
      const fileName = `tiktok_${Date.now()}.mp4`
      const filePath = path.join(this.tempDir, fileName)

      const command = `yt-dlp -o "${filePath}" "${url}"`
      
      await execAsync(command)

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        return {
          success: true,
          fileName: fileName,
          fileSize: stats.size,
          filePath: filePath,
          mediaType: 'VIDEO'
        }
      } else {
        return {
          success: false,
          error: 'TikTok video indirilemedi'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `TikTok indirme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      }
    }
  }

  private async downloadInstagram(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    try {
      
      const fileName = `instagram_${Date.now()}.mp4`
      const filePath = path.join(this.tempDir, fileName)

      const command = `yt-dlp -o "${filePath}" "${url}"`
      
      await execAsync(command)

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        return {
          success: true,
          fileName: fileName,
          fileSize: stats.size,
          filePath: filePath,
          mediaType: 'VIDEO'
        }
      } else {
        return {
          success: false,
          error: 'Instagram içerik indirilemedi'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Instagram indirme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      }
    }
  }

  private async downloadTwitter(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    try {
      
      const fileName = `twitter_${Date.now()}.mp4`
      const filePath = path.join(this.tempDir, fileName)

      const command = `yt-dlp -o "${filePath}" "${url}"`
      
      await execAsync(command)

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        return {
          success: true,
          fileName: fileName,
          fileSize: stats.size,
          filePath: filePath,
          mediaType: 'VIDEO'
        }
      } else {
        return {
          success: false,
          error: 'Twitter içerik indirilemedi'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Twitter indirme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      }
    }
  }

  public async downloadAudio(url: string, platform: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    try {
      if (platform !== 'YOUTUBE') {
        return {
          success: false,
          error: 'Ses indirme sadece YouTube için destekleniyor'
        }
      }

      
      const fileName = `youtube_audio_${Date.now()}.mp3`
      const filePath = path.join(this.tempDir, fileName)

      const command = `yt-dlp -x --audio-format mp3 -o "${filePath}" "${url}"`
      
      await execAsync(command)

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        return {
          success: true,
          fileName: fileName,
          fileSize: stats.size,
          filePath: filePath,
          mediaType: 'AUDIO'
        }
      } else {
        return {
          success: false,
          error: 'YouTube ses indirilemedi'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Ses indirme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      }
    }
  }

  public cleanupFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log(`Dosya temizlendi: ${filePath}`)
      }
    } catch (error) {
      console.error('Dosya temizleme hatası:', error)
    }
  }

  public cleanupOldFiles(): void {
    try {
      const files = fs.readdirSync(this.tempDir)
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 

      files.forEach(file => {
        const filePath = path.join(this.tempDir, file)
        const stats = fs.statSync(filePath)
        
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath)
          console.log(`Eski dosya silindi: ${file}`)
        }
      })
    } catch (error) {
      console.error('Eski dosya temizleme hatası:', error)
    }
  }
}

export const downloadMedia = async (url: string, platform: string, options: DownloadOptions = {}): Promise<DownloadResult> => {
  const downloader = new MediaDownloader()
  return await downloader.downloadMedia(url, platform, options)
}

export const downloadAudio = async (url: string, platform: string, options: DownloadOptions = {}): Promise<DownloadResult> => {
  const downloader = new MediaDownloader()
  return await downloader.downloadAudio(url, platform, options)
}


export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
