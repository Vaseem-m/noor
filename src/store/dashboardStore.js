import { create } from 'zustand'
import { moodOptions, prayerItems, screenUsage } from '../data/mockDashboardData'
import {
  askDashboardChat,
  fetchDailyMirror as fetchDailyMirrorApi,
  generateInsight as generateInsightApi,
  getDashboard,
  saveDailyEntry as saveDailyEntryApi,
  saveDailyMirror as saveDailyMirrorApi,
  saveMood as saveMoodApi,
  savePrayers as savePrayersApi,
  saveScreenTime as saveScreenTimeApi,
  saveWorkout as saveWorkoutApi,
  updateDailyMirror as updateDailyMirrorApi,
} from '../services/api'

const STORAGE_KEY = 'noor.dashboard.backup'

const defaultState = {
  mood: null,
  energy: 0,
  moodNote: '',
  prayers: prayerItems.map((item) => ({ ...item, completed: false })),
  focusDuration: 0,
  gymDuration: 0,
  screenTime: screenUsage.map((item) => ({ ...item, value: 0 })),
  dashboardHistory: [],
  habitStreaks: [],
  aiInsight: '',
  dailyMirrorText: '',
  dailyMirrorEntry: null,
  dailyMirrorHistory: [],
  dashboardChatMessages: [],
  isMoodSaved: false,
  isPrayerSaved: false,
  isGymSaved: false,
  isScreenTimeSaved: false,
  loading: {
    dashboard: false,
    savingDailyEntry: false,
    generatingInsight: false,
    savingDailyMirror: false,
    fetchingDailyMirror: false,
    dashboardChat: false,
  },
  error: null,
}

function loadBackup() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const backup = raw ? JSON.parse(raw) : {}

    return {
      aiInsight: backup.aiInsight || '',
      dailyMirrorText: backup.dailyMirrorText || '',
      dailyMirrorEntry: backup.dailyMirrorEntry || null,
      dailyMirrorHistory: backup.dailyMirrorHistory || [],
    }
  } catch {
    return {}
  }
}

function persistBackup(state) {
  const backup = {
    mood: state.mood,
    energy: state.energy,
    moodNote: state.moodNote,
    prayers: state.prayers,
    focusDuration: state.focusDuration,
    gymDuration: state.gymDuration,
    screenTime: state.screenTime,
    habitStreaks: state.habitStreaks,
    aiInsight: state.aiInsight,
    dailyMirrorText: state.dailyMirrorText,
    dailyMirrorEntry: state.dailyMirrorEntry,
    dailyMirrorHistory: state.dailyMirrorHistory,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(backup))
}

function withLoading(set, key, value) {
  set((state) => ({
    loading: {
      ...state.loading,
      [key]: value,
    },
  }))
}

function mapDashboardResponse(payload) {
  if (!payload?.dailyEntry && !payload?.history) return {}

  const entry = payload.dailyEntry
  const prayers = entry?.prayer_logs?.[0]
  const latestInsight = entry?.ai_insights?.[0]?.insight || ''
  const dashboardHistory = (payload.history || [])
    .slice()
    .reverse()
    .map((item) => {
      const prayerLog = item.prayer_logs?.[0] || {}
      const completedPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].filter((name) => prayerLog[name]).length
      const social = Number(item.social_screen_time || 0)
      const productivity = Number(item.productivity_screen_time || 0)
      const entertainment = Number(item.entertainment_screen_time || 0)

      return {
        id: item.id,
        date: item.date,
        label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(item.date)),
        weekLabel: `W${Math.ceil(new Date(item.date).getDate() / 7)}`,
        mood: item.mood || 'Not set',
        energy: Number(item.energy_level || 0),
        gymMinutes: Number(item.gym_minutes || 0),
        gymHours: Number(item.gym_minutes || 0) / 60,
        screenTime: {
          social,
          productivity,
          entertainment,
          total: social + productivity + entertainment,
        },
        prayersCompleted: completedPrayers,
      }
    })

  return {
    ...(entry
      ? {
          mood: moodOptions.find((option) => option.label === entry.mood) || null,
          energy: entry.energy_level ?? defaultState.energy,
          moodNote: entry.mood_note || '',
          focusDuration: entry.focus_minutes ?? defaultState.focusDuration,
          gymDuration: entry.gym_minutes ?? defaultState.gymDuration,
        }
      : {}),
    screenTime: screenUsage.map((item) => {
      const key = `${item.label.toLowerCase()}_screen_time`
      return { ...item, value: Number(entry?.[key] ?? 0) }
    }),
    prayers: prayerItems.map((item) => ({
      ...item,
      completed: Boolean(prayers?.[item.name.toLowerCase()] ?? false),
    })),
    aiInsight: latestInsight,
    dashboardHistory,
  }
}

function buildDailyEntryPayload(state) {
  return {
    mood: state.mood?.label || 'Not set',
    energyLevel: state.energy,
    moodNote: state.moodNote,
    focusMinutes: state.focusDuration,
    gymMinutes: state.gymDuration,
    screenTime: {
      social: state.screenTime.find((item) => item.label === 'Social')?.value ?? 0,
      productivity: state.screenTime.find((item) => item.label === 'Productivity')?.value ?? 0,
      entertainment: state.screenTime.find((item) => item.label === 'Entertainment')?.value ?? 0,
    },
    prayers: {
      fajr: Boolean(state.prayers.find((item) => item.name === 'Fajr')?.completed),
      dhuhr: Boolean(state.prayers.find((item) => item.name === 'Dhuhr')?.completed),
      asr: Boolean(state.prayers.find((item) => item.name === 'Asr')?.completed),
      maghrib: Boolean(state.prayers.find((item) => item.name === 'Maghrib')?.completed),
      isha: Boolean(state.prayers.find((item) => item.name === 'Isha')?.completed),
    },
  }
}

function savedPatch(section, value) {
  const patches = {
    mood: { isMoodSaved: value },
    prayer: { isPrayerSaved: value },
    gym: { isGymSaved: value },
    screenTime: { isScreenTimeSaved: value },
    all: {
      isMoodSaved: value,
      isPrayerSaved: value,
      isGymSaved: value,
      isScreenTimeSaved: value,
    },
  }

  return patches[section] || patches.all
}

const useDashboardStore = create((set, get) => ({
  ...defaultState,
  ...loadBackup(),

  setMood: (mood) => {
    set({ mood, isMoodSaved: false })
    persistBackup(get())
  },

  setEnergy: (energy) => {
    set({ energy, isMoodSaved: false })
    persistBackup(get())
  },

  setMoodNote: (moodNote) => {
    set({ moodNote, isMoodSaved: false })
    persistBackup(get())
  },

  togglePrayer: (name) => {
    set((state) => ({
      prayers: state.prayers.map((prayer) =>
        prayer.name === name ? { ...prayer, completed: !prayer.completed } : prayer,
      ),
      isPrayerSaved: false,
    }))
    persistBackup(get())
  },

  setGymDuration: (gymDuration) => {
    set({ gymDuration, isGymSaved: false })
    persistBackup(get())
  },

  setFocusDuration: (focusDuration) => {
    set({ focusDuration })
    persistBackup(get())
  },

  setScreenTimeValue: (label, value) => {
    set((state) => ({
      screenTime: state.screenTime.map((item) => (item.label === label ? { ...item, value } : item)),
      isScreenTimeSaved: false,
    }))
    persistBackup(get())
  },

  setSectionSaved: (section, value) => {
    set(savedPatch(section, value))
    persistBackup(get())
  },

  setDailyMirrorText: (dailyMirrorText) => {
    set({ dailyMirrorText })
    persistBackup(get())
  },

  saveDailyEntry: async (section = 'all') => {
    const previous = get()
    set({ ...savedPatch(section, true), error: null })
    withLoading(set, 'savingDailyEntry', true)
    persistBackup(get())

    try {
      const state = get()
      const payload = buildDailyEntryPayload(state)
      const saveBySection = {
        mood: () =>
          saveMoodApi({
            mood: payload.mood,
            energyLevel: payload.energyLevel,
            moodNote: payload.moodNote,
          }),
        prayer: () => savePrayersApi({ prayers: payload.prayers }),
        gym: () => saveWorkoutApi({ gymMinutes: payload.gymMinutes }),
        screenTime: () => saveScreenTimeApi({ screenTime: payload.screenTime }),
        all: () => saveDailyEntryApi(payload),
      }
      const data = await (saveBySection[section] || saveBySection.all)()
      const dashboard = await getDashboard()
      const mapped = mapDashboardResponse(dashboard)

      set({ ...mapped, ...savedPatch(section, true), error: null })
      persistBackup(get())
      return data
    } catch (error) {
      set({
        isMoodSaved: previous.isMoodSaved,
        isPrayerSaved: previous.isPrayerSaved,
        isGymSaved: previous.isGymSaved,
        isScreenTimeSaved: previous.isScreenTimeSaved,
        error: error.message,
      })
      throw error
    } finally {
      withLoading(set, 'savingDailyEntry', false)
    }
  },

  generateInsight: async () => {
    withLoading(set, 'generatingInsight', true)
    set({ error: null })

    try {
      const state = get()
      const response = await generateInsightApi({
        ...buildDailyEntryPayload(state),
        dailyMirror: state.dailyMirrorText,
      })
      set({ aiInsight: response.insight || '', error: null })
      persistBackup(get())
      return response
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      withLoading(set, 'generatingInsight', false)
    }
  },

  fetchDashboard: async () => {
    withLoading(set, 'dashboard', true)
    set({ error: null })

    try {
      const response = await getDashboard()
      const mapped = mapDashboardResponse(response)
      set({ ...mapped, ...(response?.dailyEntry ? savedPatch('all', true) : savedPatch('all', false)), error: null })
      persistBackup(get())
      return response
    } catch (error) {
      set({ error: error.message })
      return null
    } finally {
      withLoading(set, 'dashboard', false)
    }
  },

  saveDailyMirror: async () => {
    const state = get()
    const previousEntry = state.dailyMirrorEntry
    const optimisticEntry = {
      ...(previousEntry || {}),
      content: state.dailyMirrorText,
      updated_at: new Date().toISOString(),
    }

    set({ dailyMirrorEntry: optimisticEntry, error: null })
    withLoading(set, 'savingDailyMirror', true)
    persistBackup(get())

    try {
      const response = previousEntry?.id
        ? await updateDailyMirrorApi(previousEntry.id, {
            content: state.dailyMirrorText,
            context: buildDailyEntryPayload(state),
          })
        : await saveDailyMirrorApi({
            content: state.dailyMirrorText,
            context: buildDailyEntryPayload(state),
          })

      set({
        dailyMirrorEntry: response.entry,
        dailyMirrorText: response.entry?.content || state.dailyMirrorText,
        aiInsight: response.entry?.ai_summary || state.aiInsight,
        dailyMirrorHistory: response.entry ? [response.entry, ...state.dailyMirrorHistory] : state.dailyMirrorHistory,
        error: null,
      })
      persistBackup(get())
      return response
    } catch (error) {
      set({ dailyMirrorEntry: previousEntry, error: error.message })
      throw error
    } finally {
      withLoading(set, 'savingDailyMirror', false)
    }
  },

  updateDailyMirror: async (id) => {
    withLoading(set, 'savingDailyMirror', true)
    set({ error: null })

    try {
      const state = get()
      const response = await updateDailyMirrorApi(id, {
        content: state.dailyMirrorText,
        context: buildDailyEntryPayload(state),
      })
      set({
        dailyMirrorEntry: response.entry,
        dailyMirrorText: response.entry?.content || state.dailyMirrorText,
        aiInsight: response.entry?.ai_summary || state.aiInsight,
        error: null,
      })
      persistBackup(get())
      return response
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      withLoading(set, 'savingDailyMirror', false)
    }
  },

  fetchDailyMirror: async () => {
    withLoading(set, 'fetchingDailyMirror', true)
    set({ error: null })

    try {
      const response = await fetchDailyMirrorApi()
      set({
        dailyMirrorEntry: response.entry || null,
        dailyMirrorText: response.entry?.content || get().dailyMirrorText,
        aiInsight: response.entry?.ai_summary || get().aiInsight,
        dailyMirrorHistory: response.entry ? [response.entry] : get().dailyMirrorHistory,
        error: null,
      })
      persistBackup(get())
      return response
    } catch (error) {
      set({ error: error.message })
      return null
    } finally {
      withLoading(set, 'fetchingDailyMirror', false)
    }
  },

  clearDashboardChat: () => {
    set({ dashboardChatMessages: [] })
  },

  askDashboardQuestion: async (question) => {
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return null

    const userMessage = { role: 'user', content: cleanQuestion }
    set((state) => ({
      dashboardChatMessages: [...state.dashboardChatMessages, userMessage],
      error: null,
    }))
    withLoading(set, 'dashboardChat', true)

    try {
      const response = await askDashboardChat(cleanQuestion)
      const assistantMessage = {
        role: 'assistant',
        content: response.answer || "I couldn't find an answer from your saved dashboard data.",
      }

      set((state) => ({
        dashboardChatMessages: [...state.dashboardChatMessages, assistantMessage],
        error: null,
      }))
      return response
    } catch (error) {
      const assistantMessage = {
        role: 'assistant',
        content: error.response?.data?.error || error.message || 'I could not answer that right now.',
      }

      set((state) => ({
        dashboardChatMessages: [...state.dashboardChatMessages, assistantMessage],
        error: assistantMessage.content,
      }))
      throw error
    } finally {
      withLoading(set, 'dashboardChat', false)
    }
  },
}))

export default useDashboardStore
