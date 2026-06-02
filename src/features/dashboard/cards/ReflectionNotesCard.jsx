import { Save } from 'lucide-react'
import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'

function ReflectionNotesCard({ reflection, onChangeReflection, onSaveReflection, isSaving }) {
  return (
    <Card className="block">
      <CardHeader
        eyebrow="Reflection Notes"
        title="Daily mirror"
        description="Close the day with one honest thought."
        action={
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            Private
          </span>
        }
      />

      <textarea
        value={reflection}
        onChange={(event) => onChangeReflection(event.target.value)}
        placeholder="What did you learn today?"
        className="mt-5 min-h-24 w-full rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-base leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-100 dark:focus:border-emerald-400/30 dark:focus:bg-slate-900 dark:focus:ring-emerald-400/10"
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={onSaveReflection}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          <Save size={16} />
          Save reflection
        </button>
      </div>
    </Card>
  )
}

export default ReflectionNotesCard
