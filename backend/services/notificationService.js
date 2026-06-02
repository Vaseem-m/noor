import twilio from 'twilio'
import { env } from '../config/env.js'
import { getTodayDailyEntry } from '../database/supabaseHelpers.js'

const twilioClient = env.twilioSid && env.twilioAuthToken ? twilio(env.twilioSid, env.twilioAuthToken) : null

function toWhatsAppAddress(number) {
  if (!number) return ''
  return number.startsWith('whatsapp:') ? number : `whatsapp:${number}`
}

function getMissingDailyCards(entry) {
  if (!entry) {
    return ['Mood', 'Daily prayers', 'Gym', 'Screen time']
  }

  const prayers = entry.prayer_logs?.[0]
  const totalScreenTime =
    Number(entry.social_screen_time || 0) +
    Number(entry.productivity_screen_time || 0) +
    Number(entry.entertainment_screen_time || 0)
  const missingCards = []

  if (!entry.mood || entry.mood === 'Not set') {
    missingCards.push('Mood')
  }

  if (!prayers) {
    missingCards.push('Daily prayers')
  }

  if (Number(entry.gym_minutes || 0) <= 0) {
    missingCards.push('Gym')
  }

  if (totalScreenTime <= 0) {
    missingCards.push('Screen time')
  }

  return missingCards
}

export function hasTwilioReminderConfig() {
  return Boolean(twilioClient && env.twilioWhatsAppNumber && env.myPhoneNumber)
}

export async function sendDailyReminder() {
  if (!hasTwilioReminderConfig()) {
    return {
      sent: false,
      reason: 'Twilio WhatsApp credentials are not configured.',
      missingCards: [],
    }
  }

  const entry = await getTodayDailyEntry()
  const missingCards = getMissingDailyCards(entry)

  if (!missingCards.length) {
    return {
      sent: false,
      reason: 'All daily cards are updated.',
      missingCards,
    }
  }

  await twilioClient.messages.create({
    from: toWhatsAppAddress(env.twilioWhatsAppNumber),
    to: toWhatsAppAddress(env.myPhoneNumber),
    body: `Assalamu Alaikum! Please update today's Noor dashboard: ${missingCards.join(', ')}.`,
  })

  return {
    sent: true,
    reason: 'WhatsApp reminder sent successfully.',
    missingCards,
  }
}

export function assertReminderSecret(req) {
  if (!env.reminderSecret) {
    const error = new Error('REMINDER_SECRET is not configured.')
    error.status = 500
    throw error
  }

  const token = req.get('x-reminder-secret') || req.query.secret

  if (token !== env.reminderSecret) {
    const error = new Error('Unauthorized reminder request.')
    error.status = 401
    throw error
  }
}
