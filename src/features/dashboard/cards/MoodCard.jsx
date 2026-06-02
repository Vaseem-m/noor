import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'
import { moodOptions } from '../../../data/mockDashboardData'

function MoodCard({
  selectedMood,
  energy,
  note,
  isSaved,
  onSelectMood,
  onChangeEnergy,
  onChangeNote,
  onSave,
  onEdit,
}) {
  return (
    <Card>
      <CardHeader
        eyebrow="Mood Today"
        title="How is your inner weather?"
        description="Capture your mood, energy, and a small note."
        action={
          isSaved ? (
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            Saved
          </div>
          ) : null
        }
      />

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {moodOptions.map((mood) => {
          const isSelected = selectedMood?.label === mood.label

          return (
            <button
              key={mood.label}
              disabled={isSaved}
              onClick={() => onSelectMood(mood)}
              className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl border p-3 text-center transition duration-300 ${
                isSelected
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-inner dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200'
                  : 'border-slate-100 bg-slate-50/80 text-slate-500 hover:border-sky-100 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300'
              } disabled:cursor-not-allowed disabled:opacity-75`}
            >
              <span className="text-2xl" aria-hidden="true">
                {mood.emoji}
              </span>
              <span className="text-[0.68rem] font-semibold sm:text-xs">{mood.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="energy-level">
            Energy level
          </label>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
            {energy}/10
          </span>
        </div>

        <input
          id="energy-level"
          type="range"
          min="0"
          max="10"
          value={energy}
          disabled={isSaved}
          onChange={(event) => onChangeEnergy(Number(event.target.value))}
          className="mt-4 h-2 w-full accent-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
        />

        <div className="mt-2 flex justify-between px-1 text-xs font-medium text-slate-400">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="mood-note">
        Notes <span className="font-medium text-slate-400">(optional)</span>
      </label>
      <textarea
        id="mood-note"
        value={note}
        disabled={isSaved}
        onChange={(event) => onChangeNote(event.target.value)}
        placeholder="Add a gentle note about your mood..."
        className="mt-3 min-h-24 w-full rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-75 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-100 dark:focus:border-emerald-400/30 dark:focus:bg-slate-900 dark:focus:ring-emerald-400/10"
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
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

export default MoodCard
