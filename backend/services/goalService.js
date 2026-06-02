import {
  createGoal,
  createLog,
  createTask,
  deleteGoal,
  deleteLog,
  deleteTask,
  getGoalById,
  getLogForUser,
  getTaskForUser,
  listGoals,
  listLogsByTask,
  listTasksByGoal,
  updateGoal,
  updateLog,
  updateTask,
} from '../repositories/goalRepository.js'

function decorateGoal(goal) {
  const isOverdue =
    goal.deadline &&
    goal.status !== 'Completed' &&
    new Date(goal.deadline).getTime() < new Date().setHours(0, 0, 0, 0)

  return {
    ...goal,
    is_overdue: Boolean(isOverdue),
  }
}

async function recalculateGoal(userId, goalId) {
  const goal = await getGoalById(userId, goalId)
  const tasks = await listTasksByGoal(goalId)
  const completedCount = tasks.filter((task) => task.is_completed).length
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0
  const status = tasks.length > 0 && completedCount === tasks.length ? 'Completed' : goal.status === 'Completed' ? 'Active' : goal.status

  return updateGoal(userId, goalId, {
    progress_percentage: progress,
    status,
  })
}

export async function getUserGoals(userId) {
  const goals = await listGoals(userId)
  const goalsWithTasks = await Promise.all(
    goals.map(async (goal) => {
      const tasks = await listTasksByGoal(goal.goal_id)
      return decorateGoal({ ...goal, tasks })
    }),
  )

  return goalsWithTasks
}

export async function getUserGoal(userId, goalId) {
  const goal = await getGoalById(userId, goalId)
  const tasks = await listTasksByGoal(goalId)
  return decorateGoal({ ...goal, tasks })
}

export async function addGoal(userId, payload) {
  return decorateGoal(await createGoal(userId, payload))
}

export async function editGoal(userId, goalId, payload) {
  return decorateGoal(await updateGoal(userId, goalId, payload))
}

export async function removeGoal(userId, goalId) {
  await deleteGoal(userId, goalId)
}

export async function getGoalTasks(userId, goalId) {
  await getGoalById(userId, goalId)
  return listTasksByGoal(goalId)
}

export async function addTask(userId, goalId, payload) {
  await getGoalById(userId, goalId)
  const task = await createTask(goalId, payload)
  await recalculateGoal(userId, goalId)
  return task
}

export async function editTask(userId, taskId, payload) {
  const task = await getTaskForUser(userId, taskId)
  const updatedTask = await updateTask(taskId, payload)
  await recalculateGoal(userId, task.goal_id)
  return updatedTask
}

export async function removeTask(userId, taskId) {
  const task = await getTaskForUser(userId, taskId)
  await deleteTask(taskId)
  await recalculateGoal(userId, task.goal_id)
}

export async function setTaskCompletion(userId, taskId, isCompleted) {
  const task = await getTaskForUser(userId, taskId)
  const updatedTask = await updateTask(taskId, {
    is_completed: isCompleted,
    completed_at: isCompleted ? new Date().toISOString() : null,
  })

  await recalculateGoal(userId, task.goal_id)
  return updatedTask
}

export async function getTaskLogs(userId, taskId) {
  await getTaskForUser(userId, taskId)
  return listLogsByTask(taskId)
}

export async function addTaskLog(userId, taskId, payload) {
  await getTaskForUser(userId, taskId)
  return createLog(taskId, payload)
}

export async function editTaskLog(userId, logId, payload) {
  await getLogForUser(userId, logId)
  return updateLog(logId, payload)
}

export async function removeTaskLog(userId, logId) {
  await getLogForUser(userId, logId)
  await deleteLog(logId)
}
