import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TodoList } from "./TodoList";
import { JournalSection } from "./JournalSection";
import { AIChatbox } from "./AIChatbox";
import { CheckCircle, Target, TrendingUp, Calendar, MessageSquare, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'todos' | 'journal' | 'chat'>('todos');
  
  const stats = {
    tasksCompleted: 12,
    totalTasks: 18,
    studyHours: 4.5,
    streak: 7
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Tracky
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your futuristic productivity companion designed for engineering excellence
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass card-3d">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success">{stats.tasksCompleted}</div>
              <div className="text-sm text-muted-foreground">Tasks Done</div>
            </CardContent>
          </Card>
          
          <Card className="glass card-3d">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{stats.totalTasks}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </CardContent>
          </Card>
          
          <Card className="glass card-3d">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">{stats.studyHours}h</div>
              <div className="text-sm text-muted-foreground">Study Time</div>
            </CardContent>
          </Card>
          
          <Card className="glass card-3d">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">{stats.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
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

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-center">
          <div className="glass rounded-xl p-2 inline-flex gap-2">
            <Button
              variant={activeSection === 'todos' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('todos')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Tasks
            </Button>
            <Button
              variant={activeSection === 'journal' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('journal')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Journal
            </Button>
            <Button
              variant={activeSection === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('chat')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-8">
        {activeSection === 'todos' && <TodoList />}
        {activeSection === 'journal' && <JournalSection />}
        {activeSection === 'chat' && <AIChatbox />}
      </div>
    </div>
  );
};

export default Dashboard;