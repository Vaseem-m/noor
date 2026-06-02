import { Router } from 'express'
import {
  getDashboard,
  postDailyEntry,
  postGenerateInsight,
  putMood,
  putPrayers,
  putScreenTime,
  putWorkout,
} from '../controllers/dashboardController.js'

const router = Router()

router.post('/daily-entry', postDailyEntry)
router.get('/dashboard', getDashboard)
router.post('/generate-insight', postGenerateInsight)
router.put('/daily-entry/mood', putMood)
router.put('/daily-entry/prayers', putPrayers)
router.put('/daily-entry/workout', putWorkout)
router.put('/daily-entry/screen-time', putScreenTime)

export default router
