import { supabase } from '../config/supabase.js'
import { getLatestDailyMirrorEntry } from '../database/supabaseHelpers.js'
import { getTodayDate } from '../utils/date.js'
import { analyzeDailyMirror } from './aiService.js'

export async function saveDailyMirror({ content, context }) {
  const aiSummary = await analyzeDailyMirror({ content, context })

  const { data, error } = await supabase
    .from('daily_mirror_entries')
    .upsert(
      {
        date: getTodayDate(),
        content,
        ai_summary: aiSummary,
      },
      { onConflict: 'date' },
    )
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updateDailyMirror(id, { content, context }) {
  const aiSummary = await analyzeDailyMirror({ content, context })

  const { data, error } = await supabase
    .from('daily_mirror_entries')
    .update({
      content,
      ai_summary: aiSummary,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function fetchLatestDailyMirror() {
  return getLatestDailyMirrorEntry()
}
