export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  userId: string;
  content: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  archived: boolean;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

export interface HabitCheck {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface Bookmark {
  id: string;
  userId: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  durationMinutes: number;
  completedAt: string;
}

export interface Report {
  id: string;
  userId: string;
  reportType: "weekly" | "quarterly" | "annual";
  periodStart: string;
  periodEnd: string;
  htmlContent: string;
  shareToken: string | null;
  emailSentAt: string | null;
  createdAt: string;
}

export interface UserPrefs {
  userId: string;
  email: string;
  displayName: string;
  weatherLocation: { lat: number; lon: number } | null;
  calendarConnected: boolean;
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  timezone: string;
}

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    description: string;
    icon: string;
  }>;
  location: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  location?: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string | null;
  color: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalLog {
  id: string;
  goalId: string;
  userId: string;
  value: number;
  date: string;
  note: string;
  createdAt: string;
}
