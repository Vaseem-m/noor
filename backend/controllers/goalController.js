import {
  validateGoalPayload,
  validateLogPayload,
  validateTaskPayload,
} from '../validation/goalValidation.js'
import {
  addGoal,
  addTask,
  addTaskLog,
  editGoal,
  editTask,
  editTaskLog,
  getGoalTasks,
  getTaskLogs,
  getUserGoal,
  getUserGoals,
  removeGoal,
  removeTask,
  removeTaskLog,
  setTaskCompletion,
} from '../services/goalService.js'

export async function getGoals(req, res, next) {
  try {
    const goals = await getUserGoals(req.user.id)
    res.json({ goals })
  } catch (error) {
    next(error)
  }
}

export async function getGoal(req, res, next) {
  try {
    const goal = await getUserGoal(req.user.id, req.params.id)
    res.json({ goal })
  } catch (error) {
    next(error)
  }
}

export async function postGoal(req, res, next) {
  try {
    const goal = await addGoal(req.user.id, validateGoalPayload(req.body))
    res.status(201).json({ goal })
  } catch (error) {
    next(error)
  }
}

export async function putGoal(req, res, next) {
  try {
    const goal = await editGoal(req.user.id, req.params.id, validateGoalPayload(req.body, { partial: true }))
    res.json({ goal })
  } catch (error) {
    next(error)
  }
}

export async function deleteGoalById(req, res, next) {
  try {
    await removeGoal(req.user.id, req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await getGoalTasks(req.user.id, req.params.goalId)
    res.json({ tasks })
  } catch (error) {
    next(error)
  }
}

export async function postTask(req, res, next) {
  try {
    const task = await addTask(req.user.id, req.params.goalId, validateTaskPayload(req.body))
    res.status(201).json({ task })
  } catch (error) {
    next(error)
  }
}

export async function putTask(req, res, next) {
  try {
    const task = await editTask(req.user.id, req.params.id, validateTaskPayload(req.body, { partial: true }))
    res.json({ task })
  } catch (error) {
    next(error)
  }
}

export async function deleteTaskById(req, res, next) {
  try {
    await removeTask(req.user.id, req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export async function patchTaskComplete(req, res, next) {
  try {
    const task = await setTaskCompletion(req.user.id, req.params.id, Boolean(req.body.isCompleted))
    res.json({ task })
  } catch (error) {
    next(error)
  }
}

export async function getLogs(req, res, next) {
  try {
    const logs = await getTaskLogs(req.user.id, req.params.taskId)
    res.json({ logs })
  } catch (error) {
    next(error)
  }
}

export async function postLog(req, res, next) {
  try {
    const log = await addTaskLog(req.user.id, req.params.taskId, validateLogPayload(req.body))
    res.status(201).json({ log })
  } catch (error) {
    next(error)
  }
}

export async function putLog(req, res, next) {
  try {
    const log = await editTaskLog(req.user.id, req.params.id, validateLogPayload(req.body, { partial: true }))
    res.json({ log })
  } catch (error) {
    next(error)
  }
}

export async function deleteLogById(req, res, next) {
  try {
    await removeTaskLog(req.user.id, req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
