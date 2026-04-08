export const pk = (userId: string) => `USER#${userId}`;

export const sk = {
  task: (taskId: string) => `TASK#${taskId}`,
  note: () => `NOTE#main`,
  habit: (habitId: string) => `HABIT#${habitId}`,
  habitCheck: (habitId: string, date: string) => `HABIT_CHECK#${habitId}#${date}`,
  bookmark: (bookmarkId: string) => `BOOKMARK#${bookmarkId}`,
  focus: (timestamp: string) => `FOCUS#${timestamp}`,
  report: (type: string, date: string) => `REPORT#${type}#${date}`,
  prefs: () => `PREFS#main`,
};

export const gsi1 = {
  taskSK: (dueDate: string, taskId: string) => `TASK#${dueDate}#${taskId}`,
  focusSK: (date: string) => `FOCUS#${date}`,
  habitCheckSK: (date: string) => `HABIT_CHECK#${date}`,
};
