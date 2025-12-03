import { useState, useEffect, useCallback } from 'react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalActiveDays: number;
  milestones: number[];
  lastCelebratedMilestone: number;
}

const STREAK_KEY = 'tracky_streak_data';
const MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365];

const getDefaultStreakData = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalActiveDays: 0,
  milestones: MILESTONES,
  lastCelebratedMilestone: 0,
});

const getTodayString = () => new Date().toISOString().split('T')[0];

const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const useStreakTracker = () => {
  const [streakData, setStreakData] = useState<StreakData>(getDefaultStreakData());
  const [newMilestone, setNewMilestone] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load streak data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STREAK_KEY);
    if (stored) {
      const data = JSON.parse(stored) as StreakData;
      const today = getTodayString();
      
      // Check if streak is still valid
      if (data.lastActiveDate) {
        const daysDiff = getDaysDifference(data.lastActiveDate, today);
        
        if (daysDiff > 1) {
          // Streak broken - reset current streak but keep longest
          data.currentStreak = 0;
        }
      }
      
      setStreakData(data);
    }
  }, []);

  // Save streak data to localStorage
  const saveStreakData = useCallback((data: StreakData) => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    setStreakData(data);
  }, []);

  // Record activity for today
  const recordActivity = useCallback(() => {
    const today = getTodayString();
    
    setStreakData(prev => {
      // Already recorded today
      if (prev.lastActiveDate === today) {
        return prev;
      }

      let newStreak = prev.currentStreak;
      let newTotalDays = prev.totalActiveDays;

      if (prev.lastActiveDate) {
        const daysDiff = getDaysDifference(prev.lastActiveDate, today);
        
        if (daysDiff === 1) {
          // Consecutive day - increase streak
          newStreak = prev.currentStreak + 1;
        } else if (daysDiff === 0) {
          // Same day - keep streak
          newStreak = prev.currentStreak;
        } else {
          // Streak broken - start fresh
          newStreak = 1;
        }
      } else {
        // First activity ever
        newStreak = 1;
      }

      newTotalDays = prev.totalActiveDays + 1;
      const newLongest = Math.max(prev.longestStreak, newStreak);

      // Check for new milestone
      const hitMilestone = MILESTONES.find(
        m => newStreak >= m && m > prev.lastCelebratedMilestone
      );

      if (hitMilestone) {
        setNewMilestone(hitMilestone);
        setShowCelebration(true);
      }

      const newData: StreakData = {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today,
        totalActiveDays: newTotalDays,
        lastCelebratedMilestone: hitMilestone || prev.lastCelebratedMilestone,
      };

      localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  // Dismiss celebration
  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    setNewMilestone(null);
  }, []);

  // Get next milestone
  const getNextMilestone = useCallback(() => {
    return MILESTONES.find(m => m > streakData.currentStreak) || null;
  }, [streakData.currentStreak]);

  // Get streak status message
  const getStreakMessage = useCallback(() => {
    const { currentStreak } = streakData;
    
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak === 1) return "Day 1 - Great start!";
    if (currentStreak < 3) return "Building momentum...";
    if (currentStreak < 7) return "You're on fire! 🔥";
    if (currentStreak < 14) return "Unstoppable! 💪";
    if (currentStreak < 30) return "Legendary consistency! 🌟";
    if (currentStreak < 100) return "You're a machine! 🤖";
    return "Hall of Fame status! 👑";
  }, [streakData.currentStreak]);

  // Check if active today
  const isActiveToday = streakData.lastActiveDate === getTodayString();

  return {
    ...streakData,
    recordActivity,
    getNextMilestone,
    getStreakMessage,
    isActiveToday,
    newMilestone,
    showCelebration,
    dismissCelebration,
  };
};
