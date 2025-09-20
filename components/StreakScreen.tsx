
import React from 'react';
import { Streak } from '../types';
import { FlameIcon } from './icons';

interface StreakScreenProps {
  streak: Streak;
  completedTodayCount: number;
  onAddMoreTasks: () => void;
  onEndSession: () => void;
}

const StreakScreen: React.FC<StreakScreenProps> = ({ streak, completedTodayCount, onAddMoreTasks, onEndSession }) => {
  return (
    <div className="h-full flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Keep Going!</h1>
      </header>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-xs text-center bg-indigo-50 rounded-2xl p-8 shadow-inner">
          <h2 className="text-2xl font-bold text-indigo-800">Great Job!</h2>
          <p className="text-indigo-600 mt-1">
            You've completed {completedTodayCount} priority {completedTodayCount > 1 ? 'tasks' : 'task'} today.
          </p>
          <div className="my-6 flex flex-col items-center">
            <FlameIcon className="w-16 h-16 text-orange-500" />
            <p className="text-5xl font-bold text-indigo-900 mt-2">{streak.count}-Day</p>
            <p className="text-lg text-indigo-500 font-medium">Streak</p>
          </div>
          <div className="space-y-3">
             <button
              onClick={onAddMoreTasks}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
            >
              Add More Tasks
            </button>
            <button
              onClick={onEndSession}
              className="w-full bg-white text-primary font-bold py-3 px-4 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              View Priorities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakScreen;
