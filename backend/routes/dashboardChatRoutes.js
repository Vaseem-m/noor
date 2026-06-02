import { Router } from 'express'
import { postDashboardChat } from '../controllers/dashboardChatController.js'

const router = Router()

router.post('/dashboard-chat', postDashboardChat)

export default router
