import { create } from 'zustand';

const { ipcRenderer } = window.require('electron');
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60;  // 5 minutes in seconds

export const useTimerStore = create((set, get) => ({
  mode: 'work', // 'work' | 'break'
  timeLeft: WORK_TIME,
  isRunning: false,
  tasks: [],
  activeTaskId: null,

  toggleTimer: () => set((state) => ({ isRunning: !state.isRunning })),

  tick: () => set((state) => {
    if (state.timeLeft > 0) {
      return { timeLeft: state.timeLeft - 1 };
    } else {
      const nextMode = state.mode === 'work' ? 'break' : 'work';
      const nextTime = nextMode === 'work' ? 25 * 60 : 5 * 60;
      
      // Trigger Native Notification via IPC Bridge
      const alertMessage = state.mode === 'work' 
        ? 'Great job! Time for a 5-minute break.' 
        : 'Break is over! Time to focus again.';
      
      ipcRenderer.send('notify-session-ended', alertMessage);
      
      return {
        mode: nextMode,
        timeLeft: nextTime,
        isRunning: false
      };
    }
  }),
  resetTimer: () => {
    const { mode } = get();
    set({
      timeLeft: mode === 'work' ? WORK_TIME : BREAK_TIME,
      isRunning: false,
    });
  },

  addTask: (text) =>
    set((state) => ({
      tasks: [...state.tasks, { id: Date.now().toString(), text, completed: false }],
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
    })),

  toggleTaskCompleted: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),

  setActiveTask: (id) =>
    set((state) => ({
      activeTaskId: state.activeTaskId === id ? null : id,
    })),
}));
