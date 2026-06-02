import { chatWithDashboardData } from '../services/dashboardChatService.js'

export async function postDashboardChat(req, res, next) {
  try {
    const result = await chatWithDashboardData(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
