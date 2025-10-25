import TelegramBotService from './telegramBot'

let botService: TelegramBotService | null = null

export async function startTelegramBot() {
  try {
    if (!botService) {
      botService = new TelegramBotService()
      await botService.start()
    }
  } catch (error) {
    console.error('Failed to start Telegram bot:', error)
  }
}

export async function stopTelegramBot() {
  try {
    if (botService) {
      await botService.stop()
      botService = null
    }
  } catch (error) {
    console.error('Failed to stop Telegram bot:', error)
  }
}

export function isBotRunning(): boolean {
  return botService?.isBotRunning() || false
}
