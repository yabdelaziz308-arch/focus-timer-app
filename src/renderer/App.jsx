import React, { useEffect, useState } from 'react';
import { useTimerStore } from './store/useTimerStore';

function App() {
  const {
    mode,
    timeLeft,
    isRunning,
    tasks,
    activeTaskId,
    toggleTimer,
    tick,
    resetTimer,
    addTask,
    deleteTask,
    toggleTaskCompleted,
    setActiveTask,
  } = useTimerStore();

  const [taskInput, setTaskInput] = useState('');

  // Manage the countdown interval timer based on the active running state
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  // Convert raw time remaining seconds into readable MM:SS digital countdown format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskInput.trim()) {
      addTask(taskInput.trim());
      setTaskInput('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
      {/* Countdown Timer Module */}
      <div style={{ background: '#313244', padding: '30px', borderRadius: '15px', marginBottom: '20px' }}>
        <h2 style={{ color: mode === 'work' ? '#f38ba8' : '#a6e3a1', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
          {mode === 'work' ? '⏳ Work Session' : '☕ Break Time'}
        </h2>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'monospace', margin: '15px 0' }}>
          {formatTime(timeLeft)}
        </div>
        <div>
          <button 
            onClick={toggleTimer} 
            style={{ padding: '10px 20px', fontSize: '1rem', background: isRunning ? '#fab387' : '#a6e3a1', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={resetTimer} 
            style={{ padding: '10px 20px', fontSize: '1rem', background: '#eba0b3', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Task Tracker & List Module */}
      <div style={{ background: '#313244', padding: '20px', borderRadius: '15px', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #45475a', paddingBottom: '5px' }}>📋 Task Tracker</h3>
        
        <form onSubmit={handleAddTask} style={{ display: 'flex', marginBottom: '15px' }}>
          <input 
            type="text" 
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="What are you working on?" 
            style={{ flex: 1, padding: '8px', borderRadius: '5px 0 0 5px', border: 'none', background: '#45475a', color: '#cdd6f4' }}
          />
          <button type="submit" style={{ padding: '8px 15px', background: '#cba6f7', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer', fontWeight: 'bold' }}>
            Add
          </button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tasks.map(task => (
            <li 
              key={task.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '8px', 
                background: activeTaskId === task.id ? '#45475a' : '#1e1e2e', 
                borderRadius: '5px', 
                marginBottom: '8px',
                borderLeft: activeTaskId === task.id ? '4px solid #cba6f7' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, cursor: 'pointer' }} onClick={() => setActiveTask(task.id)}>
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleTaskCompleted(task.id)}
                  onClick={(e) => e.stopPropagation()} 
                />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#6c7086' : '#cdd6f4' }}>
                  {task.text}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)} 
                style={{ background: 'none', border: 'none', color: '#f38ba8', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;