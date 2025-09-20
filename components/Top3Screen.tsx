
import React from 'react';
import { Task } from '../types';

interface Top3ScreenProps {
  tasks: Task[];
  onCompleteTask: (id: number) => void;
}

const rankColors = [
  'text-indigo-500',
  'text-purple-500',
  'text-violet-500',
];

const TaskItem: React.FC<{ task: Task; index: number; onCompleteTask: (id: number) => void }> = ({ task, index, onCompleteTask }) => {
  return (
    <div className={`p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ${task.isCompleted ? 'opacity-50 bg-gray-50' : ''}`}>
      <div className="flex items-start gap-4">
        <span className={`text-2xl font-bold ${rankColors[index % rankColors.length]}`}>
          {index + 1}.
        </span>
        <div className="flex-grow">
          <p className={`text-gray-800 ${task.isCompleted ? 'line-through' : ''}`}>
            {task.text}
          </p>
        </div>
        <div className="flex-shrink-0">
          {!task.isCompleted ? (
            <button
              onClick={() => onCompleteTask(task.id)}
              className="bg-primary text-white font-semibold text-sm py-2 px-4 rounded-lg shadow hover:bg-primary-dark transition-colors"
            >
              Mark Complete
            </button>
          ) : (
             <div className="flex items-center justify-center w-[120px] h-9">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};


const Top3Screen: React.FC<Top3ScreenProps> = ({ tasks, onCompleteTask }) => {
  const allCompleted = tasks.length > 0 && tasks.every(t => t.isCompleted);

  return (
    <div className="h-full flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Top 3 Tasks Today</h1>
      </header>
      {allCompleted ? (
         <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <svg className="w-16 h-16 text-accent mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">All tasks completed!</h3>
            <p className="text-gray-500 mt-2">Amazing work today. Check your progress to see your streak.</p>
        </div>
      ) : (
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <TaskItem key={task.id} task={task} index={index} onCompleteTask={onCompleteTask} />
        ))}
      </div>
      )}
    </div>
  );
};

export default Top3Screen;
