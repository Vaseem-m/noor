import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'

function formatGymTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes} min`
  if (remainingMinutes === 0) return `${hours}h`

  return `${hours}h ${remainingMinutes}m`
}

function GymStatusCard({ data, minutes, isSaved, onChangeMinutes, onSave, onEdit }) {
  return (
    <Card>
      <CardHeader
        eyebrow="Gym Status"
        title="Workout time"
        description="Log your movement for the day."
        action={
          <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
              <data.icon size={21} />
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              {isSaved ? 'Saved' : 'Active'}
            </span>
          </div>
        }
      />

      <div className="mt-8">
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {formatGymTime(minutes)}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Workout duration: {formatGymTime(minutes)}
        </p>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="gym-time">
            Gym time
          </label>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
            {formatGymTime(minutes)}
          </span>
        </div>

        <input
          id="gym-time"
          type="number"
          min="0"
          max="300"
          step="5"
          value={minutes}
          disabled={isSaved}
          onChange={(event) => onChangeMinutes(Math.min(Math.max(Number(event.target.value) || 0, 0), 300))}
          className="mt-4 w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-400/10"
        />
        <p className="mt-2 text-xs font-medium text-slate-400">Enter workout duration in minutes.</p>
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

export default GymStatusCard
