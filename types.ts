
export interface Task {
  id: number;
  text: string;
  isCompleted: boolean;
}

export enum Screen {
  ADD_TASKS = 'ADD_TASKS',
  TOP_3 = 'TOP_3',
  STREAK = 'STREAK',
  PROGRESS = 'PROGRESS',
}

export interface Streak {
  count: number;
  lastCompletedDate: string | null;
}
