import {
  getDailyEntryHistory,
  getTodayDailyEntry,
  insertInsight,
  updateDailyEntryFields,
  updateTodayPrayers,
  upsertDailyEntry,
} from '../database/supabaseHelpers.js'
import { generateDailyInsight } from './aiService.js'

export async function saveDailyEntry(payload) {
  return upsertDailyEntry(payload)
}

export async function fetchDashboard() {
  const [dailyEntry, history] = await Promise.all([getTodayDailyEntry(), getDailyEntryHistory(60)])

  return {
    dailyEntry,
    history,
  }
}

export async function generateAndSaveInsight(payload) {
  const dailyEntry = await upsertDailyEntry(payload)
  const insight = await generateDailyInsight(payload)
  const savedInsight = await insertInsight(dailyEntry.id, insight)

  return {
    insight,
    savedInsight,
    dailyEntry,
  }
}

export async function saveMood(payload) {
  return updateDailyEntryFields({
    mood: payload.mood || 'Not set',
    energy_level: payload.energyLevel ?? 0,
    mood_note: payload.moodNote || null,
  })
}

export async function savePrayers(payload) {
  return updateTodayPrayers(payload.prayers || payload)
}

export async function saveWorkout(payload) {
  return updateDailyEntryFields({
    gym_minutes: payload.gymMinutes ?? payload.minutes ?? 0,
  })
}

export async function saveScreenTime(payload) {
  const screenTime = payload.screenTime || payload

  return updateDailyEntryFields({
    social_screen_time: screenTime.social ?? 0,
    productivity_screen_time: screenTime.productivity ?? 0,
    entertainment_screen_time: screenTime.entertainment ?? 0,
  })
}
