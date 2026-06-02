import { useEffect, useMemo } from 'react'
import { Settings2 } from 'lucide-react'
import { statsCards } from '../../data/mockDashboardData'
import useDashboardStore from '../../store/dashboardStore'
import AIInsightCard from './cards/AIInsightCard'
import GymStatusCard from './cards/GymStatusCard'
import GoalsTasksCard from './cards/GoalsTasksCard'
import MoodCard from './cards/MoodCard'
import PrayerTrackerCard from './cards/PrayerTrackerCard'
import ScreenTimeCard from './cards/ScreenTimeCard'

function Dashboard() {
  const {
    mood: selectedMood,
    energy: moodEnergy,
    moodNote,
    prayers,
    isPrayerSaved,
    gymDuration: gymMinutes,
    isGymSaved,
    screenTime: screenTimes,
    isScreenTimeSaved,
    dashboardHistory,
    dailyMirrorText: reflection,
    dashboardChatMessages,
    aiInsight,
    loading,
    isMoodSaved,
    setMood,
    setEnergy,
    setMoodNote,
    togglePrayer,
    setGymDuration,
    setScreenTimeValue,
    setSectionSaved,
    saveDailyEntry,
    generateInsight,
    fetchDashboard,
    askDashboardQuestion,
    clearDashboardChat,
  } = useDashboardStore()

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(new Date()),
    [],
  )

  const completedPrayers = prayers.filter((prayer) => prayer.completed).length
  const prayerProgress = Math.round((completedPrayers / prayers.length) * 100)

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-[2.25rem] border border-white/70 bg-white/65 px-5 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{today}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              Hi, Vaseem
            </h1>
          </div>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label="Open settings"
          >
            <Settings2 size={20} />
          </button>
        </header>

        <section className="columns-1 gap-6 lg:columns-2">
          <MoodCard
            selectedMood={selectedMood}
            energy={moodEnergy}
            note={moodNote}
            isSaved={isMoodSaved}
            onSelectMood={(mood) => {
              setMood(mood)
            }}
            onChangeEnergy={(energy) => {
              setEnergy(energy)
            }}
            onChangeNote={(note) => {
              setMoodNote(note)
            }}
            onSave={() => saveDailyEntry('mood')}
            onEdit={() => setSectionSaved('mood', false)}
          />
          <PrayerTrackerCard
            prayers={prayers}
            progress={prayerProgress}
            isSaved={isPrayerSaved}
            onTogglePrayer={togglePrayer}
            onSave={() => saveDailyEntry('prayer')}
            onEdit={() => setSectionSaved('prayer', false)}
          />
          <AIInsightCard
            mood={selectedMood}
            energy={moodEnergy}
            moodNote={moodNote}
            prayers={prayers}
            prayerProgress={prayerProgress}
            gymMinutes={gymMinutes}
            screenTimes={screenTimes}
            reflection={reflection}
            history={dashboardHistory}
            aiInsight={aiInsight}
            isGenerating={loading.generatingInsight}
            onGenerateInsight={generateInsight}
            chatMessages={dashboardChatMessages}
            isChatLoading={loading.dashboardChat}
            onAskQuestion={askDashboardQuestion}
            onClearChat={clearDashboardChat}
          />
          <GymStatusCard
            data={statsCards[1]}
            minutes={gymMinutes}
            isSaved={isGymSaved}
            onChangeMinutes={(minutes) => {
              setGymDuration(minutes)
            }}
            onSave={() => saveDailyEntry('gym')}
            onEdit={() => setSectionSaved('gym', false)}
          />
          <ScreenTimeCard
            usage={screenTimes}
            isSaved={isScreenTimeSaved}
            onChangeUsage={(label, value) => {
              setScreenTimeValue(label, value)
            }}
            onSave={() => saveDailyEntry('screenTime')}
            onEdit={() => setSectionSaved('screenTime', false)}
          />
          <GoalsTasksCard />
        </section>

      </div>
    </main>
  )
}

export default Dashboard
