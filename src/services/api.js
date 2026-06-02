import axios from 'axios'
import { supabase } from '../features/dashboard/supabase'

const deployTarget = import.meta.env.VITE_DEPLOY_TARGET || 'local'
const apiBaseUrlByTarget = {
  local: 'http://localhost:4000/api',
  production: '/api',
  custom: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
}

const apiClient = axios.create({
  baseURL: apiBaseUrlByTarget[deployTarget] || apiBaseUrlByTarget.local,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export async function saveDailyEntry(payload) {
  const { data } = await apiClient.post('/daily-entry', payload)
  return data
}

export async function saveMood(payload) {
  const { data } = await apiClient.put('/daily-entry/mood', payload)
  return data
}

export async function savePrayers(payload) {
  const { data } = await apiClient.put('/daily-entry/prayers', payload)
  return data
}

export async function saveWorkout(payload) {
  const { data } = await apiClient.put('/daily-entry/workout', payload)
  return data
}

export async function saveScreenTime(payload) {
  const { data } = await apiClient.put('/daily-entry/screen-time', payload)
  return data
}

export async function getDashboard() {
  const { data } = await apiClient.get('/dashboard')
  return data
}

export async function generateInsight(payload) {
  const { data } = await apiClient.post('/generate-insight', payload)
  return data
}

export async function saveDailyMirror(payload) {
  const { data } = await apiClient.post('/daily-mirror', payload)
  return data
}

export async function updateDailyMirror(id, payload) {
  const { data } = await apiClient.put(`/daily-mirror/${id}`, payload)
  return data
}

export async function fetchDailyMirror() {
  const { data } = await apiClient.get('/daily-mirror/latest')
  return data
}

export async function askDashboardChat(question) {
  const { data } = await apiClient.post('/dashboard-chat', { question })
  return data
}

export async function fetchGoals() {
  const { data } = await apiClient.get('/goals')
  return data
}

export async function fetchGoal(id) {
  const { data } = await apiClient.get(`/goals/${id}`)
  return data
}

export async function createGoal(payload) {
  const { data } = await apiClient.post('/goals', payload)
  return data
}

export async function updateGoal(id, payload) {
  const { data } = await apiClient.put(`/goals/${id}`, payload)
  return data
}

export async function deleteGoal(id) {
  await apiClient.delete(`/goals/${id}`)
}

export async function fetchTasks(goalId) {
  const { data } = await apiClient.get(`/goals/${goalId}/tasks`)
  return data
}

export async function createTask(goalId, payload) {
  const { data } = await apiClient.post(`/goals/${goalId}/tasks`, payload)
  return data
}

export async function updateTask(id, payload) {
  const { data } = await apiClient.put(`/tasks/${id}`, payload)
  return data
}

export async function deleteTask(id) {
  await apiClient.delete(`/tasks/${id}`)
}

export async function updateTaskCompletion(id, isCompleted) {
  const { data } = await apiClient.patch(`/tasks/${id}/complete`, { isCompleted })
  return data
}

export async function fetchTaskLogs(taskId) {
  const { data } = await apiClient.get(`/tasks/${taskId}/logs`)
  return data
}

export async function createTaskLog(taskId, payload) {
  const { data } = await apiClient.post(`/tasks/${taskId}/logs`, payload)
  return data
}

export async function updateTaskLog(id, payload) {
  const { data } = await apiClient.put(`/logs/${id}`, payload)
  return data
}

export async function deleteTaskLog(id) {
  await apiClient.delete(`/logs/${id}`)
}

export default apiClient
