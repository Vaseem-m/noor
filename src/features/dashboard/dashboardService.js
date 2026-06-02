import { saveDailyEntry } from '../../services/api'

export const saveDashboardRecord = async (recordData) => {
  const response = await saveDailyEntry(recordData)
  return response.dailyEntry
}
