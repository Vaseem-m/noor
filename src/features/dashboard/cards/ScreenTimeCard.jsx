import { Smartphone } from 'lucide-react'
import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'

function ScreenTimeCard({ usage, isSaved, onChangeUsage, onSave, onEdit }) {
  const total = usage.reduce((sum, item) => sum + item.value, 0)
  const max = Math.max(...usage.map((item) => item.value), 1)

  return (
    <Card>
      <CardHeader
        eyebrow="Screen Time"
        title={`${total.toFixed(1)}h total`}
        description="Compare social, productive, and entertainment usage."
        action={
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
            <Smartphone size={21} />
          </div>
        }
      />

      <div className="mt-7 grid grid-cols-3 items-end gap-4">
        {usage.map((item) => (
          <div key={item.label} className="flex flex-col gap-3">
            <div className="flex h-32 items-end rounded-3xl bg-slate-50 p-2 dark:bg-slate-800/70">
              <div
                className={`w-full rounded-2xl ${item.color} transition-all duration-700`}
                style={{ height: item.value > 0 ? `${Math.max((item.value / max) * 100, 18)}%` : '0%' }}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">{item.label}</p>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.value.toFixed(1)}h</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Manual entry</p>
          {isSaved ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              Saved
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {usage.map((item) => (
            <label key={item.label} className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">{item.label}</span>
              <input
                type="number"
                min="0"
                max="24"
                step="0.1"
                value={item.value}
                disabled={isSaved}
                onChange={(event) =>
                  onChangeUsage(item.label, Math.min(Math.max(Number(event.target.value) || 0, 0), 24))
                }
                className="mt-2 w-full rounded-2xl border border-slate-100 bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-200 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-sky-400/10"
              />
            </label>
          ))}
        </div>

        <p className="mt-3 text-xs font-medium text-slate-400">Enter time in hours, for example 1.5 for 1h 30m.</p>
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

export default ScreenTimeCard
