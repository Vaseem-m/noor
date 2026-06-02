import { Check } from 'lucide-react'
import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'
import ProgressRing from '../../../components/ui/ProgressRing'

function PrayerTrackerCard({ prayers, progress, isSaved, onTogglePrayer, onSave, onEdit }) {
  return (
    <Card>
      <CardHeader
        eyebrow="Prayer Tracker"
        title="Daily prayers"
        description="Mark each prayer as you complete it."
        action={<ProgressRing value={progress} size={76} stroke={8} label={`${progress}%`} progressClassName="text-sky-400" />}
      />

      <div className="mt-5 space-y-2">
        {prayers.map((prayer) => (
          <button
            key={prayer.name}
            disabled={isSaved}
            onClick={() => onTogglePrayer(prayer.name)}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-left transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-slate-800/70 dark:hover:bg-emerald-400/10"
          >
            <span className="font-medium text-slate-700 dark:text-slate-200">{prayer.name}</span>
            <span
              className={`grid h-7 w-7 place-items-center rounded-full border transition ${
                prayer.completed
                  ? 'border-emerald-400 bg-emerald-400 text-white'
                  : 'border-slate-200 bg-white text-transparent dark:border-slate-700 dark:bg-slate-900'
              }`}
            >
              <Check size={16} />
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={onSave}
          disabled={isSaved}
          className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:hover:translate-y-0 dark:disabled:bg-emerald-800"
        >
          Save
        </button>
        <button
          onClick={onEdit}
          disabled={!isSaved}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Edit
        </button>
      </div>
    </Card>
  )
}

export default PrayerTrackerCard
