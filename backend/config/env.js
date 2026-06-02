import dotenv from 'dotenv'

dotenv.config()

const deployTarget = process.env.VITE_DEPLOY_TARGET || 'local'

export const env = {
  deployTarget,
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openAiApiKey: process.env.OPENAI_API_KEY,
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  developmentUserId: process.env.DEVELOPMENT_USER_ID,
  twilioSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioWhatsAppNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  myPhoneNumber: process.env.MY_WHATSAPP_NUMBER,
  notificationTimezone: process.env.NOTIFICATION_TIMEZONE || 'Asia/Kolkata',
  reminderSecret: process.env.REMINDER_SECRET,
  enableInternalCron: deployTarget === 'server-cron',
}

export function assertServerEnv() {
  const missing = []

  if (!env.supabaseUrl) missing.push('SUPABASE_URL or VITE_SUPABASE_URL')
  if (!env.supabaseAnonKey) missing.push('SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY')

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
