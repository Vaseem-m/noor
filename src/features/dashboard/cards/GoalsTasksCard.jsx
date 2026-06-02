import { useEffect, useMemo, useState } from 'react'
import {
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  Edit3,
  ListChecks,
  Pause,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'
import ProgressRing from '../../../components/ui/ProgressRing'
import useGoalStore from '../../../store/goalStore'

const emptyGoalForm = {
  title: '',
  description: '',
  deadline: '',
  status: 'Active',
}

const emptyTaskForm = {
  title: '',
  description: '',
  deadline: '',
}

function formatDate(value) {
  if (!value) return 'No deadline'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function toInputDate(value) {
  return value ? value.slice(0, 10) : ''
}

function getTaskSummary(goal) {
  const tasks = goal?.tasks || []
  const completed = tasks.filter((task) => task.is_completed).length
  return `${completed}/${tasks.length} tasks`
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/75 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function GoalModal({ goal, isSaving, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    goal
      ? {
          title: goal.title || '',
          description: goal.description || '',
          deadline: toInputDate(goal.deadline),
          status: goal.status || 'Active',
        }
      : emptyGoalForm,
  )

  function submit(event) {
    event.preventDefault()
    onSave(form, goal?.goal_id)
  }

  return (
    <Modal title={goal ? 'Edit goal' : 'New goal'} onClose={onClose}>
      <form onSubmit={submit} className="mt-5 grid gap-3">
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Goal title"
          className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-400/10"
        />
        <textarea
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Why does this goal matter?"
          className="min-h-24 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-6 outline-none transition focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-400/10"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            value={form.deadline}
            onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
            className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-400/10"
          />
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-400/10"
          >
            <option>Active</option>
            <option>Completed</option>
            <option>Paused</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSaving || !form.title.trim()}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:hover:translate-y-0"
        >
          <Save size={16} />
          Save goal
        </button>
      </form>
    </Modal>
  )
}

function TaskModal({ task, isSaving, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    task
      ? {
          title: task.title || '',
          description: task.description || '',
          deadline: toInputDate(task.deadline),
        }
      : emptyTaskForm,
  )

  function submit(event) {
    event.preventDefault()
    onSave(form, task?.task_id)
  }

  return (
    <Modal title={task ? 'Edit task' : 'New task'} onClose={onClose}>
      <form onSubmit={submit} className="mt-5 grid gap-3">
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Task title"
          className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-400/10"
        />
        <textarea
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="What needs to happen?"
          className="min-h-24 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-6 outline-none transition focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-400/10"
        />
        <input
          type="date"
          value={form.deadline}
          onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
          className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-400/10"
        />
        <button
          type="submit"
          disabled={isSaving || !form.title.trim()}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:hover:translate-y-0"
        >
          <Save size={16} />
          Save task
        </button>
      </form>
    </Modal>
  )
}

function ActionLogEditor({ task, logs, isSaving, onLoadLogs, onSaveLog, onDeleteLog }) {
  const [notes, setNotes] = useState('')
  const [editingLog, setEditingLog] = useState(null)

  useEffect(() => {
    if (task?.task_id) {
      onLoadLogs(task.task_id)
    }
  }, [onLoadLogs, task?.task_id])

  function saveLog() {
    if (!notes.trim()) return

    onSaveLog(task.task_id, notes, editingLog?.log_id).then(() => {
      setNotes('')
      setEditingLog(null)
    })
  }

  if (!task) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Select a task to add action updates.
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Action logs</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{task.title}</p>
        </div>
        {editingLog ? (
          <button
            type="button"
            onClick={() => {
              setEditingLog(null)
              setNotes('')
            }}
            className="text-xs font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Add an update for this task."
        className="mt-3 min-h-20 w-full rounded-3xl border border-slate-100 bg-white/80 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-400/10"
      />
      <button
        type="button"
        onClick={saveLog}
        disabled={isSaving || !notes.trim()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-200"
      >
        <Save size={16} />
        Save update
      </button>

      <div className="mt-4 grid gap-2">
        {logs.length ? (
          logs.map((log) => (
            <article
              key={log.log_id}
              className="rounded-2xl border border-slate-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{log.notes}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-400">{formatDate(log.created_at)}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLog(log)
                      setNotes(log.notes)
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    aria-label="Edit action log"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteLog(task.task_id, log.log_id)}
                    className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    aria-label="Delete action log"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-2xl bg-white p-3 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            No updates yet.
          </p>
        )}
      </div>
    </div>
  )
}

function GoalsTasksCard() {
  const {
    goals,
    selectedGoalId,
    selectedTaskId,
    logsByTaskId,
    loading,
    error,
    loadGoals,
    selectGoal,
    selectTask,
    clearSelection,
    saveGoal,
    removeGoal,
    setGoalStatus,
    saveTask,
    removeTask,
    toggleTaskComplete,
    loadLogs,
    saveLog,
    removeLog,
  } = useGoalStore()
  const [goalModal, setGoalModal] = useState(null)
  const [taskModal, setTaskModal] = useState(null)

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.goal_id === selectedGoalId) || null,
    [goals, selectedGoalId],
  )
  const activeGoals = goals.filter((goal) => goal.status !== 'Completed').length

  async function handleSaveGoal(payload, goalId) {
    await saveGoal(payload, goalId)
    setGoalModal(null)
  }

  async function handleSaveTask(payload, taskId) {
    if (!selectedGoal) return
    await saveTask(selectedGoal.goal_id, payload, taskId)
    setTaskModal(null)
  }

  function toggleGoal(goalId) {
    if (selectedGoalId === goalId) {
      clearSelection()
      return
    }

    selectGoal(goalId)
  }

  return (
    <Card className="min-h-[28.5rem]">
      <CardHeader
        eyebrow="Goal Execution"
        title="Goals & Tasks"
        description="Break goals into trackable tasks and action updates."
        action={
          <button
            type="button"
            onClick={() => setGoalModal({ mode: 'create' })}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            <Plus size={16} />
            Goal
          </button>
        }
      />

      {error ? (
        <p className="mt-5 rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="mt-6 rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Goals listing</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{activeGoals} active</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-300">
            {goals.length} total
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          {loading.goals ? (
            <p className="rounded-2xl bg-white p-3 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              Loading goals...
            </p>
          ) : goals.length ? (
            goals.map((goal) => {
              const isOpen = selectedGoalId === goal.goal_id
              const goalTasks = goal.tasks || []
              const currentTask = isOpen
                ? goalTasks.find((task) => task.task_id === selectedTaskId) || null
                : null

              return (
                <article
                  key={goal.goal_id}
                  className={`overflow-hidden rounded-3xl border bg-white transition dark:bg-slate-900 ${
                    isOpen
                      ? 'border-emerald-200 shadow-sm dark:border-emerald-400/30'
                      : 'border-transparent hover:border-sky-100 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleGoal(goal.goal_id)}
                    className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-center sm:justify-between"
                    aria-expanded={isOpen}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-slate-950 dark:text-white">{goal.title}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            goal.is_overdue
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-200'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
                          }`}
                        >
                          {goal.is_overdue ? 'Overdue' : goal.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>{getTaskSummary(goal)}</span>
                        <span className="flex items-center gap-1.5">
                          <CalendarClock size={13} />
                          {formatDate(goal.deadline)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${goal.progress_percentage || 0}%` }}
                          />
                        </div>
                        <span className="min-w-11 text-right text-sm font-bold text-slate-900 dark:text-white">
                          {goal.progress_percentage || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <ProgressRing
                        value={goal.progress_percentage || 0}
                        size={56}
                        stroke={6}
                        label={`${goal.progress_percentage || 0}%`}
                        progressClassName="text-emerald-400"
                      />
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 text-slate-500 transition dark:border-slate-700 dark:text-slate-300 ${
                          isOpen ? 'rotate-180 bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10' : 'bg-white dark:bg-slate-900'
                        }`}
                      >
                        <ChevronDown size={18} />
                      </span>
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                      <div className="rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
                        <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {goal.description || 'No description yet.'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setTaskModal({ mode: 'create' })}
                            className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-200"
                          >
                            <Plus size={15} />
                            Task
                          </button>
                          <button
                            type="button"
                            onClick={() => setGoalModal({ mode: 'edit', goal })}
                            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label="Edit goal"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setGoalStatus(goal, goal.status === 'Paused' ? 'Active' : 'Paused')}
                            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label={goal.status === 'Paused' ? 'Resume goal' : 'Pause goal'}
                          >
                            {goal.status === 'Paused' ? <Check size={16} /> : <Pause size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setGoalStatus(goal, 'Completed')}
                            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label="Complete goal"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGoal(goal.goal_id)}
                            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label="Delete goal"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        {goalTasks.length ? (
                          goalTasks.map((task) => (
                            <article
                              key={task.task_id}
                              className={`rounded-3xl border p-4 transition ${
                                selectedTaskId === task.task_id
                                  ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-400/30 dark:bg-emerald-400/10'
                                  : 'border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  type="button"
                                  onClick={() => toggleTaskComplete(goal.goal_id, task)}
                                  className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition ${
                                    task.is_completed
                                      ? 'border-emerald-400 bg-emerald-400 text-white'
                                      : 'border-slate-300 bg-white text-transparent hover:border-emerald-300 dark:border-slate-600 dark:bg-slate-900'
                                  }`}
                                  aria-label={task.is_completed ? 'Reopen task' : 'Complete task'}
                                >
                                  <Check size={14} strokeWidth={3} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => selectTask(task.task_id)}
                                  className="min-w-0 flex-1 text-left"
                                >
                                  <p
                                    className={`font-semibold ${
                                      task.is_completed ? 'text-slate-400 line-through' : 'text-slate-950 dark:text-white'
                                    }`}
                                  >
                                    {task.title}
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {task.description || 'No task notes.'}
                                  </p>
                                  <p className="mt-2 text-xs font-semibold text-slate-400">{formatDate(task.deadline)}</p>
                                </button>
                                <div className="flex shrink-0 gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setTaskModal({ mode: 'edit', task })}
                                    className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800"
                                    aria-label="Edit task"
                                  >
                                    <Edit3 size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeTask(goal.goal_id, task.task_id)}
                                    className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-slate-800"
                                    aria-label="Delete task"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))
                        ) : (
                          <div className="rounded-3xl border border-dashed border-slate-200 p-4 text-center dark:border-slate-700">
                            <ListChecks className="mx-auto text-slate-400" size={28} />
                            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">No tasks yet</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <ActionLogEditor
                          key={currentTask?.task_id || 'empty-log-editor'}
                          task={currentTask}
                          logs={logsByTaskId[currentTask?.task_id] || []}
                          isSaving={loading.savingLog}
                          onLoadLogs={loadLogs}
                          onSaveLog={saveLog}
                          onDeleteLog={removeLog}
                        />
                      </div>
                    </div>
                  ) : null}
                </article>
              )
            })
          ) : (
            <p className="rounded-2xl bg-white p-3 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              Create your first goal to start tracking execution.
            </p>
          )}
        </div>
      </div>

      {goalModal ? (
        <GoalModal
          goal={goalModal.goal}
          isSaving={loading.savingGoal}
          onClose={() => setGoalModal(null)}
          onSave={handleSaveGoal}
        />
      ) : null}

      {taskModal ? (
        <TaskModal
          task={taskModal.task}
          isSaving={loading.savingTask}
          onClose={() => setTaskModal(null)}
          onSave={handleSaveTask}
        />
      ) : null}
    </Card>
  )
}

export default GoalsTasksCard
