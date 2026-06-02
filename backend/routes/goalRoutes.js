import { Router } from 'express'
import {
  deleteGoalById,
  deleteLogById,
  deleteTaskById,
  getGoal,
  getGoals,
  getLogs,
  getTasks,
  patchTaskComplete,
  postGoal,
  postLog,
  postTask,
  putGoal,
  putLog,
  putTask,
} from '../controllers/goalController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

router.get('/goals', getGoals)
router.get('/goals/:id', getGoal)
router.post('/goals', postGoal)
router.put('/goals/:id', putGoal)
router.delete('/goals/:id', deleteGoalById)

router.get('/goals/:goalId/tasks', getTasks)
router.post('/goals/:goalId/tasks', postTask)
router.put('/tasks/:id', putTask)
router.delete('/tasks/:id', deleteTaskById)
router.patch('/tasks/:id/complete', patchTaskComplete)

router.get('/tasks/:taskId/logs', getLogs)
router.post('/tasks/:taskId/logs', postLog)
router.put('/logs/:id', putLog)
router.delete('/logs/:id', deleteLogById)

export default router
