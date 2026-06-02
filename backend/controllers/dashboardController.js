import {
  fetchDashboard,
  generateAndSaveInsight,
  saveDailyEntry,
  saveMood,
  savePrayers,
  saveScreenTime,
  saveWorkout,
} from '../services/dashboardService.js'

export async function postDailyEntry(req, res, next) {
  try {
    const dailyEntry = await saveDailyEntry(req.body)
    res.status(201).json({ dailyEntry })
  } catch (error) {
    next(error)
  }
}

export async function getDashboard(req, res, next) {
  try {
    const dashboard = await fetchDashboard()
    res.json(dashboard)
  } catch (error) {
    next(error)
  }
}

export async function postGenerateInsight(req, res, next) {
  try {
    const result = await generateAndSaveInsight(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function putMood(req, res, next) {
  try {
    const dailyEntry = await saveMood(req.body)
    res.json({ dailyEntry })
  } catch (error) {
    next(error)
  }
}

export async function putPrayers(req, res, next) {
  try {
    const dailyEntry = await savePrayers(req.body)
    res.json({ dailyEntry })
  } catch (error) {
    next(error)
  }
}

export async function putWorkout(req, res, next) {
  try {
    const dailyEntry = await saveWorkout(req.body)
    res.json({ dailyEntry })
  } catch (error) {
    next(error)
  }
}

export async function putScreenTime(req, res, next) {
  try {
    const dailyEntry = await saveScreenTime(req.body)
    res.json({ dailyEntry })
  } catch (error) {
    next(error)
  }
}
