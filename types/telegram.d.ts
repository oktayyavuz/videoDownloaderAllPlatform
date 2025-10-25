declare module 'node-telegram-bot-api' {
  export interface Message {
    message_id: number
    from?: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
    chat: {
      id: number
      type: string
    }
    date: number
    text?: string
  }

  export interface BotCommand {
    command: string
    description: string
  }

  export interface SendMessageOptions {
    parse_mode?: string
    reply_markup?: any
  }

  export interface EditMessageTextOptions {
    chat_id: number
    message_id: number
    parse_mode?: string
  }

  export default class TelegramBot {
    constructor(token: string, options?: { polling: boolean })
    onText(regexp: RegExp, callback: (msg: Message, match: RegExpExecArray | null) => void): void
    on(event: string, callback: (msg: Message) => void): void
    sendMessage(chatId: number, text: string, options?: SendMessageOptions): Promise<Message>
    editMessageText(text: string, options: EditMessageTextOptions): Promise<Message | boolean>
    sendDocument(chatId: number, filePath: string, options?: { caption?: string }): Promise<Message>
    stopPolling(): void
  }
}
