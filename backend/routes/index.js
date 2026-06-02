import { Router } from 'express'
import dashboardChatRoutes from './dashboardChatRoutes.js'
import dailyMirrorRoutes from './dailyMirrorRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import goalRoutes from './goalRoutes.js'
import notificationRoutes from './notificationRoutes.js'

const router = Router()

router.use(dashboardRoutes)
router.use(dashboardChatRoutes)
router.use(dailyMirrorRoutes)
router.use(goalRoutes)
router.use(notificationRoutes)

export default router
