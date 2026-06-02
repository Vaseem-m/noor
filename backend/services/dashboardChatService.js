import { getDailyEntryHistory } from '../database/supabaseHelpers.js'
import { answerDashboardQuestion } from './aiService.js'

function compactEntry(entry) {
  const prayers = entry.prayer_logs?.[0] || {}

  return {
    date: entry.date,
    mood: entry.mood,
    energy_level: entry.energy_level,
    mood_note: entry.mood_note,
    focus_minutes: entry.focus_minutes,
    gym_minutes: entry.gym_minutes,
    screen_time: {
      social: Number(entry.social_screen_time || 0),
      productivity: Number(entry.productivity_screen_time || 0),
      entertainment: Number(entry.entertainment_screen_time || 0),
    },
    prayers: {
      fajr: Boolean(prayers.fajr),
      dhuhr: Boolean(prayers.dhuhr),
      asr: Boolean(prayers.asr),
      maghrib: Boolean(prayers.maghrib),
      isha: Boolean(prayers.isha),
    },
  }
}

export async function chatWithDashboardData({ question }) {
  const cleanQuestion = typeof question === 'string' ? question.trim() : ''

  if (!cleanQuestion) {
    const error = new Error('Question is required.')
    error.status = 400
    throw error
  }

  const entries = await getDailyEntryHistory(90)
  const compactEntries = entries.map(compactEntry)
  const answer = await answerDashboardQuestion({ question: cleanQuestion, entries: compactEntries })

  return {
    answer,
    entriesAnalyzed: compactEntries.length,
  }
}
