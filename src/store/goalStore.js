import { create } from 'zustand'
import {
  createGoal,
  createTask,
  createTaskLog,
  deleteGoal,
  deleteTask,
  deleteTaskLog,
  fetchGoals,
  fetchTaskLogs,
  updateGoal,
  updateTask,
  updateTaskCompletion,
  updateTaskLog,
} from '../services/api'

const defaultState = {
  goals: [],
  selectedGoalId: null,
  selectedTaskId: null,
  logsByTaskId: {},
  loading: {
    goals: false,
    savingGoal: false,
    savingTask: false,
    savingLog: false,
  },
  error: null,
}

function withLoading(set, key, value) {
  set((state) => ({
    loading: {
      ...state.loading,
      [key]: value,
    },
  }))
}

function applyGoal(goals, goal) {
  const exists = goals.some((item) => item.goal_id === goal.goal_id)
  return exists
    ? goals.map((item) => (item.goal_id === goal.goal_id ? { ...item, ...goal } : item))
    : [goal, ...goals]
}

function applyTask(goals, goalId, task) {
  return goals.map((goal) => {
    if (goal.goal_id !== goalId) return goal

    const tasks = goal.tasks || []
    const exists = tasks.some((item) => item.task_id === task.task_id)

    return {
      ...goal,
      tasks: exists ? tasks.map((item) => (item.task_id === task.task_id ? task : item)) : [...tasks, task],
    }
  })
}

const useGoalStore = create((set, get) => ({
  ...defaultState,

  selectGoal: (goalId) => set({ selectedGoalId: goalId, selectedTaskId: null }),
  selectTask: (taskId) => set({ selectedTaskId: taskId }),
  clearSelection: () => set({ selectedGoalId: null, selectedTaskId: null }),

  loadGoals: async () => {
    withLoading(set, 'goals', true)
    set({ error: null })

    try {
      const response = await fetchGoals()
      const goals = response.goals || []
      set((state) => ({
        goals,
        selectedGoalId: goals.some((goal) => goal.goal_id === state.selectedGoalId) ? state.selectedGoalId : null,
        error: null,
      }))
      return goals
    } catch (error) {
      set({ error: error.response?.data?.error || error.message })
      return []
    } finally {
      withLoading(set, 'goals', false)
    }
  },

  saveGoal: async (payload, goalId) => {
    withLoading(set, 'savingGoal', true)
    set({ error: null })

    try {
      const response = goalId ? await updateGoal(goalId, payload) : await createGoal(payload)
      set((state) => ({
        goals: applyGoal(state.goals, response.goal),
        selectedGoalId: goalId ? response.goal.goal_id : state.selectedGoalId,
        error: null,
      }))
      await get().loadGoals()
      return response.goal
    } catch (error) {
      set({ error: error.response?.data?.error || error.message })
      throw error
    } finally {
      withLoading(set, 'savingGoal', false)
    }
  },

  removeGoal: async (goalId) => {
    set({ error: null })
    await deleteGoal(goalId)
    set((state) => {
      const goals = state.goals.filter((goal) => goal.goal_id !== goalId)
      return {
        goals,
        selectedGoalId: state.selectedGoalId === goalId ? goals[0]?.goal_id || null : state.selectedGoalId,
        selectedTaskId: null,
      }
    })
  },

  setGoalStatus: async (goal, status) => {
    return get().saveGoal(
      {
        title: goal.title,
        description: goal.description || '',
        deadline: goal.deadline || '',
        status,
      },
      goal.goal_id,
    )
  },

  saveTask: async (goalId, payload, taskId) => {
    withLoading(set, 'savingTask', true)
    set({ error: null })

    try {
      const response = taskId ? await updateTask(taskId, payload) : await createTask(goalId, payload)
      set((state) => ({
        goals: applyTask(state.goals, goalId, response.task),
        selectedTaskId: response.task.task_id,
        error: null,
      }))
      await get().loadGoals()
      return response.task
    } catch (error) {
      set({ error: error.response?.data?.error || error.message })
      throw error
    } finally {
      withLoading(set, 'savingTask', false)
    }
  },

  removeTask: async (goalId, taskId) => {
    set({ error: null })
    await deleteTask(taskId)
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.goal_id === goalId
          ? { ...goal, tasks: (goal.tasks || []).filter((task) => task.task_id !== taskId) }
          : goal,
      ),
      selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
    }))
    await get().loadGoals()
  },

  toggleTaskComplete: async (goalId, task) => {
    const response = await updateTaskCompletion(task.task_id, !task.is_completed)
    set((state) => ({
      goals: applyTask(state.goals, goalId, response.task),
    }))
    await get().loadGoals()
    return response.task
  },

  loadLogs: async (taskId) => {
    const response = await fetchTaskLogs(taskId)
    set((state) => ({
      logsByTaskId: {
        ...state.logsByTaskId,
        [taskId]: response.logs || [],
      },
    }))
    return response.logs || []
  },

  saveLog: async (taskId, notes, logId) => {
    withLoading(set, 'savingLog', true)
    set({ error: null })

    try {
      const response = logId ? await updateTaskLog(logId, { notes }) : await createTaskLog(taskId, { notes })
      set((state) => {
        const logs = state.logsByTaskId[taskId] || []
        const exists = logs.some((log) => log.log_id === response.log.log_id)
        const nextLogs = exists
          ? logs.map((log) => (log.log_id === response.log.log_id ? response.log : log))
          : [response.log, ...logs]

        return {
          logsByTaskId: {
            ...state.logsByTaskId,
            [taskId]: nextLogs,
          },
          error: null,
        }
      })
      return response.log
    } catch (error) {
      set({ error: error.response?.data?.error || error.message })
      throw error
    } finally {
      withLoading(set, 'savingLog', false)
    }
  },

  removeLog: async (taskId, logId) => {
    await deleteTaskLog(logId)
    set((state) => ({
      logsByTaskId: {
        ...state.logsByTaskId,
        [taskId]: (state.logsByTaskId[taskId] || []).filter((log) => log.log_id !== logId),
      },
    }))
  },
}))

export default useGoalStore
