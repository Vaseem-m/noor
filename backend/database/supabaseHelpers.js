import { supabase } from '../config/supabase.js'
import { getTodayDate } from '../utils/date.js'

export function toDailyEntryRow(payload) {
  return {
    date: payload.date || getTodayDate(),
    mood: payload.mood || 'Not set',
    energy_level: payload.energyLevel ?? 0,
    mood_note: payload.moodNote || null,
    focus_minutes: payload.focusMinutes ?? 0,
    gym_minutes: payload.gymMinutes ?? 0,
    social_screen_time: payload.screenTime?.social ?? 0,
    productivity_screen_time: payload.screenTime?.productivity ?? 0,
    entertainment_screen_time: payload.screenTime?.entertainment ?? 0,
  }
}

export function toPrayerLogRow(dailyEntryId, prayers = {}) {
  return {
    daily_entry_id: dailyEntryId,
    fajr: Boolean(prayers.fajr),
    dhuhr: Boolean(prayers.dhuhr),
    asr: Boolean(prayers.asr),
    maghrib: Boolean(prayers.maghrib),
    isha: Boolean(prayers.isha),
  }
}

export async function getLatestDailyEntry() {
  const { data, error } = await supabase
    .from('daily_entries')
    .select(
      `
      *,
      prayer_logs (*),
      ai_insights (*)
    `,
    )
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getTodayDailyEntry() {
  const { data, error } = await supabase
    .from('daily_entries')
    .select(
      `
      *,
      prayer_logs (*),
      ai_insights (*)
    `,
    )
    .eq('date', getTodayDate())
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getDailyEntryHistory(limit = 60) {
  const { data, error } = await supabase
    .from('daily_entries')
    .select(
      `
      *,
      prayer_logs (*),
      ai_insights (*)
    `,
    )
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function ensureTodayDailyEntry() {
  const existingEntry = await getTodayDailyEntry()
  if (existingEntry) return existingEntry

  const { data, error } = await supabase
    .from('daily_entries')
    .insert(toDailyEntryRow({}))
    .select()
    .single()

  if (error) throw error
  return getDailyEntryById(data.id)
}

export async function upsertDailyEntry(payload) {
  const { data: dailyEntry, error: dailyEntryError } = await supabase
    .from('daily_entries')
    .upsert(toDailyEntryRow(payload), { onConflict: 'date' })
    .select()
    .single()

  if (dailyEntryError) throw dailyEntryError

  if (payload.prayers) {
    const { error: prayerError } = await supabase
      .from('prayer_logs')
      .upsert(toPrayerLogRow(dailyEntry.id, payload.prayers), { onConflict: 'daily_entry_id' })

    if (prayerError) throw prayerError
  }

  return getDailyEntryById(dailyEntry.id)
}

export async function updateDailyEntryFields(fields) {
  const dailyEntry = await ensureTodayDailyEntry()

  const { data, error } = await supabase
    .from('daily_entries')
    .update(fields)
    .eq('id', dailyEntry.id)
    .select()
    .single()

  if (error) throw error
  return getDailyEntryById(data.id)
}

export async function updateTodayPrayers(prayers) {
  const dailyEntry = await ensureTodayDailyEntry()

  const { error } = await supabase
    .from('prayer_logs')
    .upsert(toPrayerLogRow(dailyEntry.id, prayers), { onConflict: 'daily_entry_id' })

  if (error) throw error
  return getDailyEntryById(dailyEntry.id)
}

export async function getDailyEntryById(id) {
  const { data, error } = await supabase
    .from('daily_entries')
    .select(
      `
      *,
      prayer_logs (*),
      ai_insights (*)
    `,
    )
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function insertInsight(dailyEntryId, insight) {
  const { data, error } = await supabase
    .from('ai_insights')
    .insert({
      daily_entry_id: dailyEntryId,
      insight,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getLatestDailyMirrorEntry() {
  const { data, error } = await supabase
    .from('daily_mirror_entries')
    .select('*')
    .order('date', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}
