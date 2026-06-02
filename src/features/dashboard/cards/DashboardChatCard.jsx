import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import Card from '../../../components/ui/Card'
import CardHeader from '../../../components/ui/CardHeader'

const quickQuestions = [
  'When did I skip the gym?',
  'How was my screen time recently?',
  'What was my latest mood?',
]

function DashboardChatCard({ messages, isLoading, onAsk }) {
  const [question, setQuestion] = useState('')

  async function submitQuestion(event) {
    event.preventDefault()
    const cleanQuestion = question.trim()
    if (!cleanQuestion || isLoading) return

    setQuestion('')
    await onAsk(cleanQuestion)
  }

  return (
    <Card className="block">
      <CardHeader
        eyebrow="Data Chat"
        title="Ask your dashboard"
        description="Chat with your saved mood, prayer, workout, and screen-time data."
        action={
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
            <Sparkles size={21} />
          </div>
        }
      />

      <div className="mt-5 max-h-[28rem] space-y-3 overflow-y-auto rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
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
          placeholder="Ask about your saved habits..."
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
    </Card>
  )
}

export default DashboardChatCard
