import OpenAI from 'openai'
import { env } from '../config/env.js'
import { buildDailyInsightPrompt, buildDailyMirrorPrompt, buildDashboardChatPrompt } from '../prompts/insightPrompts.js'

const fallbackInsight =
  'Today has enough signals to notice gently: your mood, attention, prayer rhythm, and reflection are beginning to form a clearer pattern. Return to one small grounding act before the day closes, without turning the whole day into a project.'

const openai = env.openAiApiKey
  ? new OpenAI({
      apiKey: env.openAiApiKey,
    })
  : null

function isOpenAiQuotaError(error) {
  const message = String(error?.message || '').toLowerCase()

  return error?.status === 429 && (message.includes('quota') || message.includes('billing'))
}

function withQuotaNotice(localAnswer) {
  return `OpenAI API quota is not active for this key yet, so I used the saved dashboard data locally. ${localAnswer}`
}

async function createReflection(prompt) {
  if (!openai) return fallbackInsight

  try {
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 220,
    })

    return response.output_text?.trim() || fallbackInsight
  } catch (error) {
    if (isOpenAiQuotaError(error)) return fallbackInsight
    throw error
  }
}

export async function generateDailyInsight(payload) {
  return createReflection(buildDailyInsightPrompt(payload))
}

export async function analyzeDailyMirror(payload) {
  return createReflection(buildDailyMirrorPrompt(payload))
}

function formatSkippedGymAnswer(entries) {
  const skipped = entries.filter((entry) => Number(entry.gym_minutes || 0) === 0)

  if (!entries.length) {
    return "I don't have any daily entries yet, so I can't tell when gym was skipped."
  }

  if (!skipped.length) {
    return 'From the saved entries I can see, you did not skip the gym on any recorded day.'
  }

  const dates = skipped.map((entry) => entry.date).slice(0, 10)
  const suffix = skipped.length > 10 ? `, and ${skipped.length - 10} more recorded day${skipped.length - 10 === 1 ? '' : 's'}` : ''
  return `You skipped the gym on ${dates.join(', ')}${suffix}.`
}

function formatLocalDataAnswer({ question, entries }) {
  const normalizedQuestion = question.toLowerCase()

  if (normalizedQuestion.includes('gym') && (normalizedQuestion.includes('skip') || normalizedQuestion.includes('miss'))) {
    return formatSkippedGymAnswer(entries)
  }

  if (!entries.length) {
    return "I don't have saved dashboard data yet. Add today's mood, prayers, workout, or screen time first, then ask me again."
  }

  const latest = entries[0]
  const screenTime =
    Number(latest.screen_time?.social || 0) +
    Number(latest.screen_time?.productivity || 0) +
    Number(latest.screen_time?.entertainment || 0)

  return `AI chat is using the local fallback because OPENAI_API_KEY is not configured. I found ${entries.length} saved entr${entries.length === 1 ? 'y' : 'ies'}. The latest one is ${latest.date}: mood ${latest.mood}, energy ${latest.energy_level}/10, gym ${latest.gym_minutes} min, and screen time ${screenTime.toFixed(1)}h.`
}

export async function answerDashboardQuestion(payload) {
  if (!openai) return formatLocalDataAnswer(payload)

  try {
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: buildDashboardChatPrompt(payload),
      temperature: 0.4,
      max_output_tokens: 320,
    })

    return response.output_text?.trim() || formatLocalDataAnswer(payload)
  } catch (error) {
    if (isOpenAiQuotaError(error)) {
      return withQuotaNotice(formatLocalDataAnswer(payload))
    }

    throw error
  }
}
