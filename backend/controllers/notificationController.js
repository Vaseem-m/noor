import { assertReminderSecret, sendDailyReminder } from '../services/notificationService.js'

export async function postDailyReminder(req, res, next) {
  try {
    assertReminderSecret(req)
    const result = await sendDailyReminder()

    res.json(result)
  } catch (error) {
    next(error)
  }
}
