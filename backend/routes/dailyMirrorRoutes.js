import { Router } from 'express'
import {
  getLatestDailyMirror,
  postDailyMirror,
  putDailyMirror,
} from '../controllers/dailyMirrorController.js'

const router = Router()

router.post('/daily-mirror', postDailyMirror)
router.put('/daily-mirror/:id', putDailyMirror)
router.get('/daily-mirror/latest', getLatestDailyMirror)

export default router
