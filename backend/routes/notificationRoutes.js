import { Router } from 'express'
import { postDailyReminder } from '../controllers/notificationController.js'

const router = Router()

router.post('/notifications/daily-reminder', postDailyReminder)

export default router
