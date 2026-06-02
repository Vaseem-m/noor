import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Pause, Play, RotateCcw, Square } from 'lucide-react'
import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'
import ProgressRing from '../../../components/ui/ProgressRing'

const quickDurations = [15, 25, 45, 60]
const feedbackOptions = ['Fully focused', 'Mostly focused', 'Distracted']

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function FocusCard({ data, onChangeDuration }) {
  const [durationMinutes, setDurationMinutes] = useState(25)
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackNote, setFeedbackNote] = useState('')
  const [isFeedbackSaved, setIsFeedbackSaved] = useState(false)

  const totalSeconds = durationMinutes * 60
  const elapsedSeconds = totalSeconds - remainingSeconds
  const timerProgress = Math.round((elapsedSeconds / totalSeconds) * 100)

  const statusLabel = useMemo(() => {
    if (isComplete) return 'Session complete'
    if (isRunning) return 'In focus'
    if (elapsedSeconds > 0) return 'Paused'
    return 'Ready'
  }, [elapsedSeconds, isComplete, isRunning])

  useEffect(() => {
    if (!isRunning || isComplete) return undefined

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId)
          setIsRunning(false)
          setIsComplete(true)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isComplete, isRunning])

  function updateDuration(minutes) {
    const safeMinutes = Math.min(Math.max(minutes, 1), 180)

    setDurationMinutes(safeMinutes)
    setRemainingSeconds(safeMinutes * 60)
    setIsRunning(false)
    setIsComplete(false)
    setFeedback('')
    setFeedbackNote('')
    setIsFeedbackSaved(false)
    onChangeDuration?.(safeMinutes)
  }

  function startTimer() {
    setIsRunning(true)
    setIsComplete(false)
    setIsFeedbackSaved(false)
  }

  function pauseTimer() {
    setIsRunning(false)
  }

  function resetTimer() {
    setRemainingSeconds(totalSeconds)
    setIsRunning(false)
    setIsComplete(false)
    setFeedback('')
    setFeedbackNote('')
    setIsFeedbackSaved(false)
  }

  function completeTimer() {
    setRemainingSeconds(0)
    setIsRunning(false)
    setIsComplete(true)
  }

  return (
    <Card className="min-h-[28.5rem]">
      <div className="flex min-h-[25.5rem] flex-col">
        <CardHeader
          eyebrow="Focus Hours"
          title="Focus timer"
          description="Start a timed session and reflect when it ends."
          action={
            <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                <data.icon size={21} />
              </div>
              <p className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                {statusLabel}
              </p>
            </div>
          }
        />

        <div className="mt-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="mt-1 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {formatTime(remainingSeconds)}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {durationMinutes} min focus interval
            </p>
          </div>
          <ProgressRing
            value={timerProgress}
            size={104}
            stroke={9}
            label={`${timerProgress}%`}
            progressClassName="text-emerald-400"
          />
        </div>

        <div className="mt-7 rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="focus-duration">
            Set timer
          </label>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {quickDurations.map((minutes) => (
              <button
                key={minutes}
                onClick={() => updateDuration(minutes)}
                disabled={isRunning}
                className={`rounded-2xl border px-2 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  durationMinutes === minutes
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-sky-100 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {minutes}m
              </button>
            ))}
          </div>

          <input
            id="focus-duration"
            type="number"
            min="1"
            max="180"
            value={durationMinutes}
            disabled={isRunning}
            onChange={(event) => updateDuration(Number(event.target.value) || 1)}
            className="mt-3 w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-400/10"
          />
        </div>

        <div className="mt-auto grid grid-cols-1 gap-3 pt-5 sm:grid-cols-3">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            disabled={isComplete}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-200"
          >
            {isRunning ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={completeTimer}
            disabled={isComplete || elapsedSeconds === 0}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Square size={15} fill="currentColor" />
            End
          </button>
          <button
            onClick={resetTimer}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {isComplete ? (
        <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-emerald-600 dark:text-emerald-300" size={20} />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">How focused was this interval?</p>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Capture the truth gently. It helps your focus rhythm improve.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {feedbackOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setFeedback(option)
                  setIsFeedbackSaved(false)
                }}
                disabled={isFeedbackSaved}
                className={`rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-75 ${
                  feedback === option
                    ? 'border-emerald-300 bg-white text-emerald-700 shadow-sm dark:border-emerald-400/30 dark:bg-slate-900 dark:text-emerald-300'
                    : 'border-transparent bg-white/70 text-slate-500 hover:bg-white dark:bg-slate-900/50 dark:text-slate-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <textarea
            value={feedbackNote}
            disabled={isFeedbackSaved}
            onChange={(event) => {
              setFeedbackNote(event.target.value)
              setIsFeedbackSaved(false)
            }}
            placeholder="Optional note: what helped or distracted you?"
            className="mt-3 min-h-24 w-full rounded-3xl border border-emerald-100 bg-white/80 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-75 dark:border-emerald-400/20 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:ring-emerald-400/10"
          />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsFeedbackSaved(true)}
              disabled={!feedback || isFeedbackSaved}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:hover:translate-y-0 dark:disabled:bg-emerald-800"
            >
              Save feedback
            </button>
            <button
              onClick={() => setIsFeedbackSaved(false)}
              disabled={!isFeedbackSaved}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Edit
            </button>
          </div>
        </div>
      ) : null}
    </Card>
  )
}

export default FocusCard
