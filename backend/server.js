import cors from 'cors'
import express from 'express'
import cron from 'node-cron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertServerEnv, env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { hasTwilioReminderConfig, sendDailyReminder } from './services/notificationService.js'
import apiRoutes from './routes/index.js'

assertServerEnv()
console.log(`Backend running with deployTarget=${env.deployTarget}, enableInternalCron=${env.enableInternalCron}, notificationTimezone=${env.notificationTimezone}`)

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')

if (env.enableInternalCron) {
  // Schedule a daily check at 10:00 PM (22:00)
  cron.schedule('0 22 * * *', async () => {
    console.log('Running 10 PM WhatsApp reminder check...')

    if (!hasTwilioReminderConfig()) {
      console.warn('Twilio credentials missing. WhatsApp reminder skipped.')
      return
    }

    try {
      const result = await sendDailyReminder()
      console.log(result.reason)
    } catch (err) {
      console.error('Failed to run WhatsApp scheduled task:', err)
    }
  }, {
    timezone: env.notificationTimezone,
  })
} else {
  console.log('Internal reminder cron disabled. Use /api/notifications/daily-reminder or an external scheduler.')
}

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'noor-api' })
})

app.use('/api', apiRoutes)
app.use(express.static(distPath))

app.get(/^\/(?!api|health).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`Noor API listening on port ${env.port}`)
})
