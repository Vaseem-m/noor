import { Brain, Dumbbell } from 'lucide-react'

export const moodOptions = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Focused', emoji: '🎯' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Anxious', emoji: '🌧️' },
]

export const prayerItems = [
  { name: 'Fajr', completed: true },
  { name: 'Dhuhr', completed: true },
  { name: 'Asr', completed: false },
  { name: 'Maghrib', completed: false },
  { name: 'Isha', completed: false },
]

export const screenUsage = [
  { label: 'Social', value: 2.1, color: 'bg-sky-400' },
  { label: 'Productivity', value: 3.4, color: 'bg-emerald-400' },
  { label: 'Entertainment', value: 1.3, color: 'bg-slate-400' },
]

export const statsCards = [
  {
    title: 'Focus Hours',
    eyebrow: 'Deep work',
    icon: Brain,
    value: '4h 15m',
    target: '/ 5h',
    percentage: 85,
  },
  {
    title: 'Gym Status',
    eyebrow: 'Body care',
    icon: Dumbbell,
    value: 'Workout time',
    target: '52 min workout',
    percentage: 100,
  },
]

export const historicalInsights = {
  week: [
    { label: 'Mon', alignment: 62, energy: 5, prayer: 40, gym: 35, focus: 52, screen: 7.4, happiness: 58 },
    { label: 'Tue', alignment: 68, energy: 6, prayer: 60, gym: 0, focus: 61, screen: 6.9, happiness: 64 },
    { label: 'Wed', alignment: 73, energy: 7, prayer: 80, gym: 50, focus: 72, screen: 6.1, happiness: 70 },
    { label: 'Thu', alignment: 66, energy: 5, prayer: 60, gym: 45, focus: 58, screen: 7.8, happiness: 62 },
    { label: 'Fri', alignment: 77, energy: 7, prayer: 100, gym: 60, focus: 74, screen: 5.9, happiness: 75 },
    { label: 'Sat', alignment: 71, energy: 6, prayer: 80, gym: 40, focus: 48, screen: 8.2, happiness: 68 },
    { label: 'Sun', alignment: 74, energy: 7, prayer: 80, gym: 55, focus: 69, screen: 6.4, happiness: 72 },
  ],
  month: [
    { label: 'W1', alignment: 61, energy: 5, prayer: 52, gym: 28, focus: 50, screen: 7.9, happiness: 59 },
    { label: 'W2', alignment: 67, energy: 6, prayer: 64, gym: 36, focus: 57, screen: 7.1, happiness: 65 },
    { label: 'W3', alignment: 70, energy: 6, prayer: 72, gym: 44, focus: 63, screen: 6.8, happiness: 68 },
    { label: 'W4', alignment: 74, energy: 7, prayer: 78, gym: 52, focus: 68, screen: 6.3, happiness: 72 },
  ],
}
