import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Navigation } from "./Navigation";
import { Hero3D } from "./Hero3D";
import { TrackyGreeting } from "./TrackyGreeting";
import { StreakTracker } from "./StreakTracker";
import { useStreakTracker } from "@/hooks/useStreakTracker";
import { CheckCircle, Target, TrendingUp, Sparkles, BookOpen, ArrowRight, Brain, Flame } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentStreak } = useStreakTracker();
  
  const stats = {
    tasksCompleted: 12,
    totalTasks: 18,
    studyHours: 4.5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section with 3D */}
      <div className="relative overflow-hidden mb-8">
        <Hero3D />
      </div>

      {/* Tracky Greeting */}
      <div className="container mx-auto px-4">
        <TrackyGreeting />
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlowCard glowColor="green" customSize className="h-auto">
            <div className="text-center py-2">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.tasksCompleted}</div>
              <div className="text-sm text-neutral-400">Tasks Done</div>
            </div>
          </GlowCard>
          
          <GlowCard glowColor="blue" customSize className="h-auto">
            <div className="text-center py-2">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
              <div className="text-sm text-neutral-400">Total Tasks</div>
            </div>
          </GlowCard>
          
          <GlowCard glowColor="purple" customSize className="h-auto">
            <div className="text-center py-2">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.studyHours}h</div>
              <div className="text-sm text-neutral-400">Study Time</div>
            </div>
          </GlowCard>
          
          <GlowCard glowColor="orange" customSize className="h-auto">
            <div className="text-center py-2">
              <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{currentStreak}</div>
              <div className="text-sm text-neutral-400">Day Streak 🔥</div>
            </div>
          </GlowCard>
        </div>

        {/* Streak Tracker */}
        <div className="mt-6">
          <StreakTracker />
        </div>

        {/* Progress Overview */}
        <Card className="glass-elevated mt-6 card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tasks Completed</span>
                  <span>{stats.tasksCompleted}/{stats.totalTasks}</span>
                </div>
                <Progress 
                  value={(stats.tasksCompleted / stats.totalTasks) * 100} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Study Goal</span>
                  <span>{stats.studyHours}/6h</span>
                </div>
                <Progress 
                  value={(stats.studyHours / 6) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">Jump into your productivity tools</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <GlowCard glowColor="blue" customSize className="h-auto min-h-[280px]">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <CheckCircle className="h-12 w-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-semibold mb-2 text-white">Manage Tasks</h3>
              <p className="text-neutral-400 mb-4 text-sm">
                Organize your daily tasks and boost productivity
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                <Link to="/tasks" className="flex items-center gap-2">
                  Go to Tasks
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GlowCard>
          
          <GlowCard glowColor="purple" customSize className="h-auto min-h-[280px]">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <Brain className="h-12 w-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-semibold mb-2 text-white">Study Planner</h3>
              <p className="text-neutral-400 mb-4 text-sm">
                AI-powered personalized study plans based on your schedule
              </p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                <Link to="/study-planner" className="flex items-center gap-2">
                  Create Plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GlowCard>
          
          <GlowCard glowColor="green" customSize className="h-auto min-h-[280px]">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <BookOpen className="h-12 w-12 text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-semibold mb-2 text-white">Personal Journal</h3>
              <p className="text-neutral-400 mb-4 text-sm">
                Reflect on your growth and daily experiences
              </p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300">
                <Link to="/journal" className="flex items-center gap-2">
                  Open Journal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GlowCard>
          
          <GlowCard glowColor="orange" customSize className="h-auto min-h-[280px]">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <Sparkles className="h-12 w-12 text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-semibold mb-2 text-white">Tracky AI</h3>
              <p className="text-neutral-400 mb-4 text-sm">
                Your accountability buddy—motivates, tracks, and keeps you on point!
              </p>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300">
                <Link to="/chat" className="flex items-center gap-2">
                  Chat with Tracky
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
