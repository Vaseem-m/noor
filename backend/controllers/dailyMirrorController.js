import {
  fetchLatestDailyMirror,
  saveDailyMirror,
  updateDailyMirror,
} from '../services/dailyMirrorService.js'

export async function postDailyMirror(req, res, next) {
  try {
    const entry = await saveDailyMirror(req.body)
    res.status(201).json({ entry })
  } catch (error) {
    next(error)
  }
}

export async function putDailyMirror(req, res, next) {
  try {
    const entry = await updateDailyMirror(req.params.id, req.body)
    res.json({ entry })
  } catch (error) {
    next(error)
  }
}

export async function getLatestDailyMirror(req, res, next) {
  try {
    const entry = await fetchLatestDailyMirror()
    res.json({ entry })
  } catch (error) {
    next(error)
  }
}
