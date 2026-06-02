import { useMemo, useState } from 'react'
import { curveMonotoneX, line as d3Line } from 'd3-shape'
import { BrainCircuit, MessageCircle, Send, Sparkles, Target, X } from 'lucide-react'
import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'
import useGoalStore from '../../../store/goalStore'

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes} min`
  if (remainingMinutes === 0) return `${hours}h`

  return `${hours}h ${remainingMinutes}m`
}

function buildInsight({ mood, energy, prayerProgress, gymMinutes, screenTimes, reflection }) {
  const moodLabel = mood?.label || 'Not set'
  const totalScreenTime = screenTimes.reduce((sum, item) => sum + item.value, 0)
  const productivity = screenTimes.find((item) => item.label === 'Productivity')?.value ?? 0
  const social = screenTimes.find((item) => item.label === 'Social')?.value ?? 0
  const entertainment = screenTimes.find((item) => item.label === 'Entertainment')?.value ?? 0
  const productivityRatio = totalScreenTime ? Math.round((productivity / totalScreenTime) * 100) : 0
  const gymScore = Math.min(Math.round((gymMinutes / 60) * 100), 100)
  const reflectionScore = reflection.trim() ? 100 : 30
  const balanceScore = Math.round(
    energy * 6 + prayerProgress * 0.25 + gymScore * 0.2 + productivityRatio * 0.2 + reflectionScore * 0.1,
  )

  const doingWell = [
    `${moodLabel} mood with ${energy}/10 energy shows active self-awareness.`,
    prayerProgress >= 60
      ? `Prayer rhythm is steady at ${prayerProgress}% completion.`
      : `Prayer tracking has started at ${prayerProgress}%; there is still room to complete the day.`,
    gymMinutes > 0
      ? `You supported your body with ${formatMinutes(gymMinutes)} of gym time.`
      : 'You are still tracking body care, which keeps the habit visible.',
    productivity >= social
      ? 'Productive screen time is stronger than social usage today.'
      : 'Your screen patterns are visible now, which makes adjustment easier.',
  ]

  const improve = [
    prayerProgress < 100 ? 'Complete the remaining prayers with calm intention.' : 'Keep the prayer rhythm gentle and consistent.',
    totalScreenTime > 6
      ? 'Reduce one block of passive screen time, especially social or entertainment usage.'
      : 'Protect the current screen-time balance and avoid late drift.',
    energy <= 5 ? 'Add rest, water, or a lighter task block before demanding deep work.' : 'Use your energy for one focused priority.',
    reflection.trim()
      ? "Turn today's reflection into one clear next action."
      : 'Add a short reflection note so the day has a clean closing thought.',
  ]

  return {
    totalScreenTime,
    productivity,
    social,
    entertainment,
    productivityRatio,
    gymScore,
    reflectionScore,
    balanceScore: Math.min(Math.max(balanceScore, 1), 100),
    summary:
      energy >= 7
        ? 'You are moving with steady energy. Your strongest pattern today is awareness across worship, body, attention, and reflection.'
        : 'Today looks reflective but lower-energy. The good sign is that the important signals are visible, so improvement can stay gentle and specific.',
    doingWell,
    improve,
  }
}

const moodColors = {
  Happy: '#f59e0b',
  Calm: '#10b981',
  Focused: '#0ea5e9',
  Tired: '#94a3b8',
  Anxious: '#8b5cf6',
  'Not set': '#cbd5e1',
}

const quickQuestions = [
  'What pattern do you see in my mood?',
  'How are prayers, gym, and screen time connected?',
  'Which goal should I focus on next?',
]

const chartBounds = {
  top: 14,
  bottom: 88,
}

function valueToPoint(items, item, index, key, max) {
  const safeMax = Math.max(Number(max || 0), 1)
  const x = items.length === 1 ? 50 : (index / (items.length - 1)) * 100
  const normalized = Math.min(Math.max(Number(item[key] || 0) / safeMax, 0), 1)
  const y = chartBounds.bottom - normalized * (chartBounds.bottom - chartBounds.top)

  return { x, y }
}

function makeLinePath(items, key, max) {
  if (items.length < 2) return ''

  const points = items.map((item, index) => valueToPoint(items, item, index, key, max))

  return d3Line()
    .x((point) => point.x)
    .y((point) => point.y)
    .curve(curveMonotoneX)(points)
}

function PlotLine({ data, valueKey, max, color, width = 2.8 }) {
  const path = makeLinePath(data, valueKey, max)

  if (!path) return null

  return (
    <>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.16"
        strokeWidth={width + 5}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={width}
        vectorEffect="non-scaling-stroke"
      />
    </>
  )
}

function AxisLabels({ labels }) {
  return (
    <>
      {labels.map((label, index) => (
        <text key={label} x="-3" y={88 - index * 18} textAnchor="end" className="fill-slate-400 text-[4px] font-semibold">
          {label}
        </text>
      ))}
    </>
  )
}

function ChartShell({ title, description, children, legend, className = '' }) {
  return (
    <div className={`rounded-3xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
          <p className="mt-1 text-xs font-medium text-slate-400">{description}</p>
        </div>
        {legend ? <div className="flex flex-wrap gap-2">{legend}</div> : null}
      </div>
      <div className="mt-5 h-64 rounded-3xl bg-slate-50 p-4 dark:bg-slate-800/70">{children}</div>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 text-sm font-semibold text-slate-400 dark:border-slate-700">
      No saved DB entries yet.
    </div>
  )
}

function SingleLineChart({ data, title, description, valueKey, max, color, axisLabels, formatter, ariaLabel, moodDots = false, className }) {
  return (
    <ChartShell title={title} description={description} className={className}>
      {data.length ? (
        <svg viewBox="-10 0 112 100" className="h-full w-full overflow-visible" role="img" aria-label={ariaLabel}>
          {[20, 40, 60, 80].map((line) => (
            <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.35" />
          ))}
          <AxisLabels labels={axisLabels} />
          <PlotLine data={data} valueKey={valueKey} max={max} color={color} />
          {data.map((item, index) => {
            const point = valueToPoint(data, item, index, valueKey, max)
            const dotColor = moodDots ? moodColors[item.mood] || moodColors['Not set'] : color

            return (
              <g key={`${item.label}-${index}`}>
                <circle cx={point.x} cy={point.y} r="4.1" fill={dotColor} opacity="0.16" />
                <circle cx={point.x} cy={point.y} r="2.7" fill="white" stroke={dotColor} strokeWidth="1.4" className="dark:fill-slate-800" />
                <circle cx={point.x} cy={point.y} r="1" fill={dotColor} />
                <text x={point.x} y={point.y - 4.5} textAnchor="middle" className="fill-slate-500 text-[3.6px] font-semibold">
                  {formatter(item[valueKey], item)}
                </text>
              </g>
            )
          })}
          {data.map((item, index) => {
            const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
            return (
              <text key={`${item.label}-axis`} x={x} y="99" textAnchor="middle" className="fill-slate-400 text-[4px] font-semibold">
                {item.label}
              </text>
            )
          })}
        </svg>
      ) : (
        <EmptyChart />
      )}
    </ChartShell>
  )
}

function MoodChart({ data, className }) {
  return (
    <ChartShell
      title="Mood energy"
      description="X-axis shows saved days or weeks. Y-axis is energy level from 1 to 10, with mood color markers."
      className={className}
      legend={Object.entries(moodColors).map(([mood, color]) => (
        <span key={mood} className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          {mood}
        </span>
      ))}
    >
      {data.length ? (
        <svg viewBox="-10 0 112 100" className="h-full w-full overflow-visible" role="img" aria-label="Mood energy graph">
          {[16, 34, 52, 70, 88].map((line) => (
            <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.35" />
          ))}
          <AxisLabels labels={['1', '3', '5', '7', '10']} />
          <PlotLine data={data} valueKey="energy" max={10} color="#334155" width={2.4} />
          {data.map((item, index) => {
            const point = valueToPoint(data, item, index, 'energy', 10)
            const dotColor = moodColors[item.mood] || moodColors['Not set']

            return (
              <g key={`${item.label}-${index}`}>
                <circle cx={point.x} cy={point.y} r="4.6" fill={dotColor} opacity="0.16" />
                <circle cx={point.x} cy={point.y} r="3" fill="white" stroke={dotColor} strokeWidth="1.5" className="dark:fill-slate-800" />
                <circle cx={point.x} cy={point.y} r="1.1" fill={dotColor} />
                <text x={point.x} y={point.y - 5} textAnchor="middle" className="fill-slate-500 text-[3.6px] font-semibold">
                  {item.energy}/10
                </text>
              </g>
            )
          })}
          {data.map((item, index) => {
            const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
            return (
              <text key={`${item.label}-axis`} x={x} y="99" textAnchor="middle" className="fill-slate-400 text-[4px] font-semibold">
                {item.label}
              </text>
            )
          })}
        </svg>
      ) : (
        <EmptyChart />
      )}
    </ChartShell>
  )
}

function ScreenTimeChart({ data, className }) {
  const series = [
    { key: 'socialHours', label: 'Social', color: '#0ea5e9' },
    { key: 'productivityHours', label: 'Productivity', color: '#10b981' },
    { key: 'entertainmentHours', label: 'Entertainment', color: '#64748b' },
  ]
  const maxHours = Math.max(1, ...data.flatMap((item) => series.map((line) => item[line.key] || 0)))

  return (
    <ChartShell
      title="Screen time"
      description="Three live DB lines for social, productivity, and entertainment. Y-axis is time in hours."
      className={className}
      legend={series.map((line) => (
        <span key={line.key} className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: line.color }} />
          {line.label}
        </span>
      ))}
    >
      {data.length ? (
        <svg viewBox="-10 0 112 100" className="h-full w-full overflow-visible" role="img" aria-label="Screen time graph">
          {[20, 40, 60, 80].map((line) => (
            <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.35" />
          ))}
          <AxisLabels labels={['0h', `${(maxHours * 0.25).toFixed(1)}h`, `${(maxHours * 0.5).toFixed(1)}h`, `${(maxHours * 0.75).toFixed(1)}h`, `${maxHours.toFixed(1)}h`]} />
          {series.map((line) => (
            <PlotLine
              key={line.key}
              data={data}
              valueKey={line.key}
              max={maxHours}
              color={line.color}
              width={2.5}
            />
          ))}
          {data.map((item, index) => {
            const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
            return (
              <text key={`${item.label}-axis`} x={x} y="99" textAnchor="middle" className="fill-slate-400 text-[4px] font-semibold">
                {item.label}
              </text>
            )
          })}
        </svg>
      ) : (
        <EmptyChart />
      )}
    </ChartShell>
  )
}

function GoalProgressChart({ goals }) {
  const chartGoals = goals.slice(0, 8)

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Goals and tasks progress</p>
          <p className="mt-1 text-xs font-medium text-slate-400">One live DB bar per goal, based on completed goal percentage.</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
          <Target size={18} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {chartGoals.length ? (
          chartGoals.map((goal) => {
            const progress = Math.min(Math.max(Number(goal.progress_percentage || 0), 0), 100)

            return (
              <div key={goal.goal_id} className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{goal.title}</p>
                  <span className="text-sm font-bold text-slate-950 dark:text-white">{progress}%</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )
          })
        ) : (
          <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            No goals saved in the DB yet.
          </p>
        )}
      </div>
    </div>
  )
}

function InsightChat({ messages = [], isLoading, onAsk }) {
  const [question, setQuestion] = useState('')

  async function submitQuestion(event) {
    event.preventDefault()
    const cleanQuestion = question.trim()
    if (!cleanQuestion || isLoading || !onAsk) return

    setQuestion('')
    await onAsk(cleanQuestion)
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Chat with AI about this data</p>
          <p className="mt-1 text-xs font-medium text-slate-400">Ask about mood, gym, screen time, prayers, goals, or patterns.</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
          <MessageCircle size={18} />
        </div>
      </div>

      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-3xl bg-slate-50/80 p-3 dark:bg-slate-800/60">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                message.role === 'user'
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-400 shadow-sm dark:bg-slate-900">
              Thinking...
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickQuestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setQuestion(item)}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
          >
            {item}
          </button>
        ))}
      </div>

      <form onSubmit={submitQuestion} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about the data in this report..."
          className="min-h-12 flex-1 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-400/10"
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:hover:translate-y-0 dark:disabled:bg-emerald-800"
        >
          <Send size={16} />
          Ask
        </button>
      </form>
    </div>
  )
}

function averageValue(items, getter) {
  if (!items.length) return 0
  return items.reduce((sum, item) => sum + getter(item), 0) / items.length
}

function formatChartTime(hours) {
  if (hours < 1) return `${Math.round(hours * 60)}m`
  return `${hours.toFixed(1)}h`
}

function buildChartHistory(history, range) {
  const recent = history.slice(range === 'week' ? -7 : -30)

  if (range === 'week') {
    return recent.map((item) => ({
      label: item.label,
      mood: item.mood,
      energy: item.energy,
      gymHours: item.gymMinutes / 60,
      socialHours: item.screenTime.social,
      productivityHours: item.screenTime.productivity,
      entertainmentHours: item.screenTime.entertainment,
      prayersCompleted: item.prayersCompleted,
    }))
  }

  const grouped = recent.reduce((groups, item) => {
    const group = groups.get(item.weekLabel) || []
    group.push(item)
    groups.set(item.weekLabel, group)
    return groups
  }, new Map())

  return [...grouped.entries()].map(([label, items]) => {
    const latest = items[items.length - 1]

    return {
      label,
      mood: latest.mood,
      energy: Math.round(averageValue(items, (item) => item.energy)),
      gymHours: averageValue(items, (item) => item.gymMinutes / 60),
      socialHours: averageValue(items, (item) => item.screenTime.social),
      productivityHours: averageValue(items, (item) => item.screenTime.productivity),
      entertainmentHours: averageValue(items, (item) => item.screenTime.entertainment),
      prayersCompleted: averageValue(items, (item) => item.prayersCompleted),
    }
  })
}

function AIInsightCard({
  mood,
  energy,
  moodNote,
  prayers,
  prayerProgress,
  gymMinutes,
  screenTimes,
  reflection,
  history = [],
  aiInsight,
  isGenerating,
  onGenerateInsight,
  chatMessages,
  isChatLoading,
  onAskQuestion,
  onClearChat,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [range, setRange] = useState('week')
  const { goals } = useGoalStore()

  const insight = useMemo(
    () => buildInsight({ mood, energy, prayerProgress, gymMinutes, screenTimes, reflection }),
    [energy, gymMinutes, mood, prayerProgress, reflection, screenTimes],
  )

  const completedPrayers = prayers.filter((prayer) => prayer.completed)
  const rangeLabel = range === 'week' ? 'past 1 week' : 'past 1 month'
  const moodLabel = mood?.label || 'Not set'
  const insightSummary = aiInsight || insight.summary
  const chartData = buildChartHistory(history, range)
  const maxGymHours = Math.max(1, ...chartData.map((item) => item.gymHours || 0))

  async function openInsights() {
    setIsModalOpen(true)

    if (!aiInsight && onGenerateInsight) {
      try {
        await onGenerateInsight()
      } catch {
        // The local insight remains available if the AI service is offline.
      }
    }
  }

  function closeInsights() {
    setIsModalOpen(false)
    onClearChat?.()
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-950 to-slate-800 text-white">
        <CardHeader
          inverse
          eyebrow="AI Insight"
          title="Your current story"
          description="A local report from today and your history."
          action={
            <div className="flex flex-col items-end gap-2">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-emerald-200">
                <BrainCircuit size={22} />
              </div>
              <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                {insight.balanceScore}% aligned
              </span>
            </div>
          }
        />

        <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-200">{insightSummary}</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-3xl bg-white/8 p-3">
              <p className="text-xs font-semibold text-slate-400">Mood</p>
              <p className="mt-1 text-lg font-semibold">{moodLabel}</p>
          </div>
          <div className="rounded-3xl bg-white/8 p-3">
            <p className="text-xs font-semibold text-slate-400">Prayer</p>
            <p className="mt-1 text-lg font-semibold">{prayerProgress}%</p>
          </div>
          <div className="rounded-3xl bg-white/8 p-3">
            <p className="text-xs font-semibold text-slate-400">Screen</p>
            <p className="mt-1 text-lg font-semibold">{insight.totalScreenTime.toFixed(1)}h</p>
          </div>
        </div>

        <button
          onClick={openInsights}
          disabled={isGenerating}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-emerald-100"
        >
          <Sparkles size={16} />
          Open AI insights
        </button>
      </Card>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-950/55 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-insight-title"
        >
          <div className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-[2rem] bg-white p-4 shadow-2xl sm:p-6 dark:bg-slate-950 dark:text-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">AI Insight Report</p>
                <h2 id="ai-insight-title" className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Today's habit intelligence
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Comparing today with the {rangeLabel}. {insightSummary}
                </p>
              </div>
              <button
                onClick={closeInsights}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Close AI insight report"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-3xl bg-slate-50 p-1 dark:bg-slate-900">
              {[
                { id: 'week', label: 'Past 1 week' },
                { id: 'month', label: 'Past 1 month' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRange(option.id)}
                  className={`rounded-[1.35rem] px-4 py-3 text-sm font-semibold transition ${
                    range === option.id
                      ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="grid gap-4 xl:grid-cols-2">
                <MoodChart data={chartData} />
                <SingleLineChart
                  data={chartData}
                  title="Gym time"
                  description="X-axis follows saved days or weeks. Y-axis shows workout time in minutes or hours."
                  valueKey="gymHours"
                  max={maxGymHours}
                  color="#0ea5e9"
                  axisLabels={['0h', formatChartTime(maxGymHours * 0.25), formatChartTime(maxGymHours * 0.5), formatChartTime(maxGymHours * 0.75), formatChartTime(maxGymHours)]}
                  formatter={(value) => formatChartTime(Number(value || 0))}
                  ariaLabel="Gym time graph"
                />
                <ScreenTimeChart data={chartData} />
                <SingleLineChart
                  data={chartData}
                  title="Daily prayers"
                  description="X-axis follows saved days or weeks. Y-axis shows completed prayers from 0 to 5."
                  valueKey="prayersCompleted"
                  max={5}
                  color="#22c55e"
                  axisLabels={['0', '1', '2', '3', '5']}
                  formatter={(value) => `${Number(value || 0).toFixed(0)}/5`}
                  ariaLabel="Daily prayers graph"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
              <GoalProgressChart goals={goals} />
              <div className="rounded-3xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Today at a glance</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-xs font-semibold text-slate-400">Mood</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{moodLabel}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-xs font-semibold text-slate-400">Prayers</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{completedPrayers.length}/5</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-xs font-semibold text-slate-400">Gym</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{formatMinutes(gymMinutes)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-xs font-semibold text-slate-400">Screen</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{insight.totalScreenTime.toFixed(1)}h</p>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Mood note: {moodNote.trim() || 'No mood note added yet.'}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-emerald-50 p-4 dark:bg-emerald-400/10">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">What is going well</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {insight.doingWell.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-sky-50 p-4 dark:bg-sky-400/10">
                <h3 className="font-semibold text-sky-800 dark:text-sky-200">What needs improvement</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {insight.improve.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
              Reflection: {reflection.trim() || "No reflection written yet. A one-line closing note would improve tomorrow's report."}
            </div>

            <div className="mt-4">
              <InsightChat messages={chatMessages} isLoading={isChatLoading} onAsk={onAskQuestion} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default AIInsightCard
