
import React from 'react';
import { Task } from '../types';
import { TrashIcon } from './icons';

interface TaskInputScreenProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onPrioritize: () => void;
  isLoading: boolean;
  error: string | null;
}

const TaskInputScreen: React.FC<TaskInputScreenProps> = ({ tasks, setTasks, onPrioritize, isLoading, error }) => {
  const updateTaskText = (id: number, text: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, text } : task)));
  };

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), text: '', isCompleted: false }]);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const nonEmptyTasks = tasks.filter(t => t.text.trim() !== '').length;

  return (
    <div className="h-full flex flex-col">
      <header className="text-center mb-6">
        <h1 className="text-gray-500 text-sm font-medium">Add Tasks</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">What's on your plate today?</h2>
      </header>
      
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      
      <div className="flex-grow space-y-3 pr-2 overflow-y-auto">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-primary">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-not-allowed"
              disabled
            />
            <input
              type="text"
              value={task.text}
              onChange={(e) => updateTaskText(task.id, e.target.value)}
              placeholder={index === tasks.length -1 ? "What's your task?" : "Enter task description..."}
              className="flex-grow bg-transparent focus:outline-none text-gray-700"
            />
            <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
              <TrashIcon className="w-5 h-5"/>
            </button>
          </div>
        ))}
        <button onClick={addTask} className="w-full text-left p-3 text-primary hover:bg-primary/10 rounded-lg">+ Add new task</button>
      </div>

      <div className="mt-6">
        <button
          onClick={onPrioritize}
          disabled={isLoading || nonEmptyTasks < 5}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-primary-dark disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Prioritizing...
            </>
          ) : (
            `Prioritize (${nonEmptyTasks}/5+)`
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskInputScreen;
