
import React from 'react';
import { Screen } from '../types';
import { ListIcon, StarIcon, ChartIcon } from './icons';

interface BottomNavProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  hasPrioritizedTasks: boolean;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}> = ({ icon, label, isActive, onClick, isDisabled }) => {
  const activeClasses = 'text-primary bg-indigo-100';
  const inactiveClasses = 'text-gray-500 hover:text-primary hover:bg-gray-100';
  const disabledClasses = 'text-gray-300 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex flex-col items-center justify-center w-1/3 py-2 rounded-lg transition-colors duration-200 ${
        isDisabled ? disabledClasses : isActive ? activeClasses : inactiveClasses
      }`}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setCurrentScreen, hasPrioritizedTasks }) => {
  return (
    <div className="w-full border-t border-gray-200 p-2 bg-white/80 backdrop-blur-sm">
      <div className="flex justify-around items-center">
        <NavItem
          icon={<ListIcon className="w-6 h-6" />}
          label="Add Tasks"
          isActive={currentScreen === Screen.ADD_TASKS}
          onClick={() => setCurrentScreen(Screen.ADD_TASKS)}
        />
        <NavItem
          icon={<StarIcon className="w-6 h-6" />}
          label="Top 3"
          isActive={currentScreen === Screen.TOP_3}
          onClick={() => setCurrentScreen(Screen.TOP_3)}
          isDisabled={!hasPrioritizedTasks}
        />
        <NavItem
          icon={<ChartIcon className="w-6 h-6" />}
          label="Progress"
          isActive={currentScreen === Screen.PROGRESS || currentScreen === Screen.STREAK}
          onClick={() => setCurrentScreen(Screen.STREAK)}
          isDisabled={!hasPrioritizedTasks}
        />
      </div>
    </div>
  );
};

export default BottomNav;
