const VALID_GOAL_STATUSES = new Set(['Active', 'Completed', 'Paused'])

function createValidationError(message) {
  const error = new Error(message)
  error.status = 400
  return error
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeDeadline(value) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw createValidationError('Deadline must be a valid date.')
  }

  return value
}

export function validateGoalPayload(payload, { partial = false } = {}) {
  const title = cleanText(payload.title)
  const description = cleanText(payload.description)
  const status = payload.status

  if (!partial && !title) {
    throw createValidationError('Goal title is required.')
  }

  if (status && !VALID_GOAL_STATUSES.has(status)) {
    throw createValidationError('Goal status must be Active, Completed, or Paused.')
  }

  const data = {}
  if (title || !partial) data.title = title
  if (description || payload.description === '') data.description = description || null
  if (payload.deadline !== undefined) data.deadline = normalizeDeadline(payload.deadline)
  if (status) data.status = status

  return data
}

export function validateTaskPayload(payload, { partial = false } = {}) {
  const title = cleanText(payload.title)
  const description = cleanText(payload.description)

  if (!partial && !title) {
    throw createValidationError('Task title is required.')
  }

  const data = {}
  if (title || !partial) data.title = title
  if (description || payload.description === '') data.description = description || null
  if (payload.deadline !== undefined) data.deadline = normalizeDeadline(payload.deadline)

  return data
}

export function validateLogPayload(payload, { partial = false } = {}) {
  const notes = cleanText(payload.notes)

  if (!partial && !notes) {
    throw createValidationError('Action log notes are required.')
  }

  const data = {}
  if (notes || !partial) data.notes = notes

  return data
}
