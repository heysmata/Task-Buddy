import React, { useState, useEffect } from 'react';
import { Screen, Task, Streak } from './types';
import TaskInputScreen from './components/TaskInputScreen';
import Top3Screen from './components/Top3Screen';
import StreakScreen from './components/StreakScreen';
import BottomNav from './components/BottomNav';
import { getPrioritizedTasks } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Design daily UI screens', isCompleted: false },
    { id: 2, text: 'Review sprint tasks', isCompleted: false },
    { id: 3, text: 'Prepare presentation slides', isCompleted: false },
    { id: 4, text: 'Respond to team emails', isCompleted: false },
    { id: 5, text: "Plan next week's priorities", isCompleted: false },
  ]);
  const [prioritizedTasks, setPrioritizedTasks] = useState<Task[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ADD_TASKS);
  const [streak, setStreak] = useLocalStorage<Streak>('taskbuddy-streak', { count: 0, lastCompletedDate: null });
  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrioritize = async () => {
    const taskTexts = tasks.map(t => t.text).filter(t => t.trim() !== '');
    if (taskTexts.length < 5) {
      setError('Please enter at least 5 tasks to prioritize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const top3Texts = await getPrioritizedTasks(taskTexts);
      const top3Tasks: Task[] = top3Texts.map((text, index) => ({
        id: Date.now() + index,
        text,
        isCompleted: false,
      }));
      setPrioritizedTasks(top3Tasks);
      setCompletedTodayCount(0);
      setCurrentScreen(Screen.TOP_3);
    } catch (err) {
      console.error(err);
      setError('Could not prioritize tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskComplete = (taskId: number) => {
    setPrioritizedTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      )
    );

    const today = new Date().toISOString().split('T')[0];
    setStreak(prevStreak => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newCount = prevStreak.count;
      if (prevStreak.lastCompletedDate === yesterdayStr) {
        newCount += 1;
      } else if (prevStreak.lastCompletedDate !== today) {
        newCount = 1;
      }
      return { count: newCount, lastCompletedDate: today };
    });
    
    setCompletedTodayCount(prev => prev + 1);
    setCurrentScreen(Screen.STREAK);
  };
  
  useEffect(() => {
    const allPrioritizedCompleted = prioritizedTasks.length > 0 && prioritizedTasks.every(t => t.isCompleted);
    if(currentScreen === Screen.TOP_3 && allPrioritizedCompleted) {
       setCurrentScreen(Screen.STREAK);
    }
  }, [prioritizedTasks, currentScreen]);


  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.ADD_TASKS:
        return (
          <TaskInputScreen
            tasks={tasks}
            setTasks={setTasks}
            onPrioritize={handlePrioritize}
            isLoading={isLoading}
            error={error}
          />
        );
      case Screen.TOP_3:
        return <Top3Screen tasks={prioritizedTasks} onCompleteTask={handleTaskComplete} />;
      case Screen.STREAK:
      case Screen.PROGRESS:
        return (
          <StreakScreen
            streak={streak}
            completedTodayCount={completedTodayCount}
            onAddMoreTasks={() => {
              setTasks([
                { id: Date.now(), text: '', isCompleted: false },
                { id: Date.now() + 1, text: '', isCompleted: false },
                { id: Date.now() + 2, text: '', isCompleted: false },
                { id: Date.now() + 3, text: '', isCompleted: false },
                { id: Date.now() + 4, text: '', isCompleted: false },
              ]);
              setCurrentScreen(Screen.ADD_TASKS);
            }}
            onEndSession={() => setCurrentScreen(Screen.TOP_3)}
          />
        );
      default:
        return <TaskInputScreen tasks={tasks} setTasks={setTasks} onPrioritize={handlePrioritize} isLoading={isLoading} error={error}/>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col sm:max-w-lg sm:mx-auto sm:my-8 sm:rounded-2xl sm:shadow-xl sm:border sm:min-h-0 sm:h-[calc(100vh-4rem)] sm:max-h-[850px] sm:overflow-hidden">
      <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
        {renderScreen()}
      </div>
      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} hasPrioritizedTasks={prioritizedTasks.length > 0} />
    </div>
  );
};

export default App;