import { supabase } from '../config/supabase.js'

function notFound(message) {
  const error = new Error(message)
  error.status = 404
  return error
}

export async function listGoals(userId) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getGoalById(userId, goalId) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .maybeSingle()

  if (error) throw error
  if (!data) throw notFound('Goal not found.')
  return data
}

export async function createGoal(userId, payload) {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      title: payload.title,
      description: payload.description || null,
      deadline: payload.deadline || null,
      status: payload.status || 'Active',
      progress_percentage: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGoal(userId, goalId, payload) {
  await getGoalById(userId, goalId)

  const { data, error } = await supabase
    .from('goals')
    .update(payload)
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGoal(userId, goalId) {
  await getGoalById(userId, goalId)

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('user_id', userId)
    .eq('goal_id', goalId)

  if (error) throw error
}

export async function listTasksByGoal(goalId) {
  const { data, error } = await supabase
    .from('goal_tasks')
    .select('*')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getTaskForUser(userId, taskId) {
  const { data: task, error } = await supabase
    .from('goal_tasks')
    .select('*')
    .eq('task_id', taskId)
    .maybeSingle()

  if (error) throw error
  if (!task) throw notFound('Task not found.')

  await getGoalById(userId, task.goal_id)
  return task
}

export async function createTask(goalId, payload) {
  const { data, error } = await supabase
    .from('goal_tasks')
    .insert({
      goal_id: goalId,
      title: payload.title,
      description: payload.description || null,
      deadline: payload.deadline || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(taskId, payload) {
  const { data, error } = await supabase
    .from('goal_tasks')
    .update(payload)
    .eq('task_id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(taskId) {
  const { error } = await supabase.from('goal_tasks').delete().eq('task_id', taskId)
  if (error) throw error
}

export async function listLogsByTask(taskId) {
  const { data, error } = await supabase
    .from('task_action_logs')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getLogForUser(userId, logId) {
  const { data: log, error } = await supabase
    .from('task_action_logs')
    .select('*')
    .eq('log_id', logId)
    .maybeSingle()

  if (error) throw error
  if (!log) throw notFound('Action log not found.')

  await getTaskForUser(userId, log.task_id)
  return log
}

export async function createLog(taskId, payload) {
  const { data, error } = await supabase
    .from('task_action_logs')
    .insert({
      task_id: taskId,
      notes: payload.notes,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateLog(logId, payload) {
  const { data, error } = await supabase
    .from('task_action_logs')
    .update(payload)
    .eq('log_id', logId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteLog(logId) {
  const { error } = await supabase.from('task_action_logs').delete().eq('log_id', logId)
  if (error) throw error
}
