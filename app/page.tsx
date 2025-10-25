'use client'

import { useState, useEffect } from 'react'
import { Download, Link, Music, Video, Image, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface DownloadResult {
  success: boolean
  download?: {
    id: string
    fileName: string
    fileSize: number
    mediaType: string
    platform: string
  }
  downloadUrl?: string
  error?: string
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [mediaType, setMediaType] = useState<'VIDEO' | 'AUDIO'>('VIDEO')
  const [quality, setQuality] = useState('best')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DownloadResult | null>(null)
  const [downloadId, setDownloadId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState('')

  
  useEffect(() => {
    if (downloadId) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/download/${downloadId}/progress`)
          const data = await response.json()
          
          if (data.progress !== undefined) {
            setProgress(data.progress)
            setDownloadStatus(data.status)
            
            if (data.status === 'COMPLETED' || data.status === 'FAILED') {
              clearInterval(interval)
              if (data.status === 'COMPLETED') {
                setResult({
                  success: true,
                  download: {
                    id: data.id,
                    fileName: data.fileName,
                    fileSize: data.fileSize,
                    mediaType: mediaType,
                    platform: detectPlatform(url)
                  },
                  downloadUrl: `/api/download/${data.id}`
                })
              } else {
                setResult({
                  success: false,
                  error: data.error || 'İndirme başarısız'
                })
              }
              setIsLoading(false)
            }
          }
        } catch (error) {
          console.error('Progress fetch error:', error)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [downloadId, url, mediaType])

  const handleDownload = async () => {
    if (!url.trim()) {
      alert('Lütfen bir URL girin')
      return
    }

    setIsLoading(true)
    setResult(null)
    setProgress(0)
    setDownloadStatus('')

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          mediaType,
          quality,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setDownloadId(data.download.id)
        setDownloadStatus('PROCESSING')
      } else {
        setResult({
          success: false,
          error: data.error,
        })
        setIsLoading(false)
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      })
      setIsLoading(false)
    }
  }

  const detectPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('tiktok.com')) return 'TikTok'
    if (url.includes('instagram.com')) return 'Instagram'
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter'
    return 'Bilinmeyen'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">RimuruTR</h1>
                <p className="text-sm text-gray-600">Medya İndirici</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://t.me/rimurutrbot"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <span>🤖</span>
                <span>Telegram Bot</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Medya İndirici
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            YouTube, TikTok, Instagram ve Twitter'dan video, ses ve resim indirin. 
            Hem web sitesi hem de Telegram botu olarak hizmet veriyoruz.
          </p>
          
          {/* Platform Icons */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">YT</span>
              </div>
              <span className="text-sm font-medium text-gray-700">YouTube</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">TT</span>
              </div>
              <span className="text-sm font-medium text-gray-700">TikTok</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">IG</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Instagram</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">X</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Twitter</span>
            </div>
          </div>
        </div>

        {/* Download Form */}
        <div className="card max-w-2xl mx-auto mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Medya URL'si
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                İndirme Türü
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMediaType('VIDEO')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    mediaType === 'VIDEO'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Video className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Video</span>
                </button>
                <button
                  onClick={() => setMediaType('AUDIO')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    mediaType === 'AUDIO'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Music className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Ses</span>
                </button>
              </div>
            </div>

            {mediaType === 'VIDEO' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Video Kalitesi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setQuality('best')}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      quality === 'best'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">En İyi</span>
                  </button>
                  <button
                    onClick={() => setQuality('1080p')}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      quality === '1080p'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">1080p</span>
                  </button>
                  <button
                    onClick={() => setQuality('720p')}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      quality === '720p'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">720p</span>
                  </button>
                  <button
                    onClick={() => setQuality('480p')}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      quality === '480p'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">480p</span>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={isLoading || !url.trim()}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>İndiriliyor...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>İndir</span>
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isLoading && downloadStatus === 'PROCESSING' && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>İndiriliyor...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="card max-w-2xl mx-auto">
            {result.success ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  İndirme Başarılı!
                </h3>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600">
                    <span className="font-medium">Platform:</span> {detectPlatform(url)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Dosya:</span> {result.download?.fileName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Boyut:</span> {formatFileSize(result.download?.fileSize || 0)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Tür:</span> {result.download?.mediaType}
                  </p>
                </div>
                <a
                  href={result.downloadUrl}
                  download
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Dosyayı İndir</span>
                </a>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  İndirme Başarısız
                </h3>
                <p className="text-gray-600 mb-4">{result.error}</p>
                <button
                  onClick={() => setResult(null)}
                  className="btn-secondary"
                >
                  Tekrar Dene
                </button>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Çoklu Platform
            </h3>
            <p className="text-gray-600">
              YouTube, TikTok, Instagram ve Twitter'dan medya indirin
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Music className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Video & Ses
            </h3>
            <p className="text-gray-600">
              Hem video hem de sadece ses dosyası olarak indirin
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Telegram Bot
            </h3>
            <p className="text-gray-600">
              Telegram üzerinden de kolayca medya indirin
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">RimuruTR</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sosyal medya platformlarından medya indirme hizmeti
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://t.me/rimurutrbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Telegram Bot
              </a>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">© 2025 RimuruTR</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
