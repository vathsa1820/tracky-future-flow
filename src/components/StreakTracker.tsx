import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Star, Zap, Crown, Target, PartyPopper, X } from "lucide-react";
import { useStreakTracker } from "@/hooks/useStreakTracker";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const celebrationMessages = [
  { milestone: 3, emoji: "🎉", title: "3-Day Streak!", message: "You're building a habit! Tracky is proud!" },
  { milestone: 7, emoji: "🔥", title: "ONE WEEK!", message: "7 days straight?! You're officially unstoppable!" },
  { milestone: 14, emoji: "⚡", title: "2 WEEKS!", message: "Two weeks of consistency! Future engineer vibes!" },
  { milestone: 21, emoji: "🌟", title: "21 DAYS!", message: "They say 21 days makes a habit. You did it!" },
  { milestone: 30, emoji: "🏆", title: "30-DAY LEGEND!", message: "A whole month! You're in the top 1% of students!" },
  { milestone: 50, emoji: "💎", title: "50 DAYS!", message: "Half a hundred! You're basically superhuman now!" },
  { milestone: 75, emoji: "🚀", title: "75 DAYS!", message: "75 days?! That's elite discipline right there!" },
  { milestone: 100, emoji: "👑", title: "100 DAYS!!!", message: "TRIPLE DIGITS! You absolute legend!" },
  { milestone: 150, emoji: "🌈", title: "150 DAYS!", message: "5 months of pure dedication. Speechless." },
  { milestone: 200, emoji: "💫", title: "200 DAYS!", message: "200 days! You've ascended to productivity heaven!" },
  { milestone: 365, emoji: "🎂", title: "ONE YEAR!!!", message: "365 DAYS! You've achieved the impossible!" },
];

interface StreakTrackerProps {
  compact?: boolean;
  onActivityRecorded?: () => void;
}

export const StreakTracker = ({ compact = false, onActivityRecorded }: StreakTrackerProps) => {
  const {
    currentStreak,
    longestStreak,
    totalActiveDays,
    isActiveToday,
    getNextMilestone,
    getStreakMessage,
    newMilestone,
    showCelebration,
    dismissCelebration,
    recordActivity,
  } = useStreakTracker();

  const nextMilestone = getNextMilestone();
  const progress = nextMilestone ? (currentStreak / nextMilestone) * 100 : 100;

  // Auto-record activity when component mounts (user opened the app)
  useEffect(() => {
    if (!isActiveToday) {
      recordActivity();
      onActivityRecorded?.();
    }
  }, []);

  const getCelebrationData = (milestone: number) => {
    return celebrationMessages.find(c => c.milestone === milestone) || celebrationMessages[0];
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
      >
        <Flame className="h-5 w-5 text-orange-400" />
        <span className="font-bold text-orange-400">{currentStreak}</span>
        <span className="text-xs text-muted-foreground">day streak</span>
      </motion.div>
    );
  }

  return (
    <>
      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && newMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={dismissCelebration}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative bg-gradient-to-br from-primary/20 via-background to-accent/20 rounded-3xl p-8 max-w-md mx-4 border border-primary/30 shadow-2xl shadow-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={dismissCelebration}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Confetti effect */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6'][i % 5],
                      left: `${Math.random() * 100}%`,
                    }}
                    initial={{ top: -10, opacity: 1 }}
                    animate={{
                      top: '110%',
                      opacity: 0,
                      rotate: Math.random() * 720,
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      delay: Math.random() * 0.5,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              <div className="text-center relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-7xl mb-4"
                >
                  {getCelebrationData(newMilestone).emoji}
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2"
                >
                  {getCelebrationData(newMilestone).title}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground mb-6"
                >
                  {getCelebrationData(newMilestone).message}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                  <PartyPopper className="h-4 w-4 text-primary" />
                  <span>— Tracky is so proud of you! —</span>
                  <PartyPopper className="h-4 w-4 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-elevated rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Background flame glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  scale: isActiveToday ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 1, repeat: isActiveToday ? Infinity : 0 }}
              >
                <Flame className={`h-6 w-6 ${isActiveToday ? 'text-orange-400' : 'text-muted-foreground'}`} />
              </motion.div>
              <h3 className="font-semibold">Streak Tracker</h3>
            </div>
            {isActiveToday && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                ✓ Active today
              </span>
            )}
          </div>

          {/* Main streak display */}
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <motion.div
                key={currentStreak}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
              >
                {currentStreak}
              </motion.div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">{getStreakMessage()}</p>
              
              {/* Progress to next milestone */}
              {nextMilestone && (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress to {nextMilestone} days</span>
                    <span>{currentStreak}/{nextMilestone}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-glass-border">
            <div className="text-center">
              <Trophy className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
              <div className="text-lg font-bold">{longestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center">
              <Star className="h-4 w-4 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold">{totalActiveDays}</div>
              <div className="text-xs text-muted-foreground">Total Days</div>
            </div>
            <div className="text-center">
              <Target className="h-4 w-4 text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold">{nextMilestone || '∞'}</div>
              <div className="text-xs text-muted-foreground">Next Goal</div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
