import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "./Navigation";
import { Hero3D } from "./Hero3D";
import { CheckCircle, Target, TrendingUp, Calendar, MessageSquare, BookOpen, ArrowRight, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = {
    tasksCompleted: 12,
    totalTasks: 18,
    studyHours: 4.5,
    streak: 7
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section with 3D */}
      <div className="relative overflow-hidden mb-8">
        <Hero3D />
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

      {/* Quick Actions */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">Jump into your productivity tools</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="glass-elevated card-3d group">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-smooth" />
              <h3 className="text-lg font-semibold mb-2">Manage Tasks</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Organize your daily tasks and boost productivity
              </p>
              <Button asChild className="w-full bg-gradient-primary hover:glow-primary transition-all duration-smooth">
                <Link to="/tasks" className="flex items-center gap-2">
                  Go to Tasks
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-elevated card-3d group">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-secondary mx-auto mb-4 group-hover:scale-110 transition-transform duration-smooth" />
              <h3 className="text-lg font-semibold mb-2">Study Planner</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                AI-powered personalized study plans based on your schedule
              </p>
              <Button asChild className="w-full bg-gradient-secondary hover:glow transition-all duration-smooth">
                <Link to="/study-planner" className="flex items-center gap-2">
                  Create Plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-elevated card-3d group">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform duration-smooth" />
              <h3 className="text-lg font-semibold mb-2">Personal Journal</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Reflect on your growth and daily experiences
              </p>
              <Button asChild className="w-full bg-gradient-accent hover:glow-accent transition-all duration-smooth">
                <Link to="/journal" className="flex items-center gap-2">
                  Open Journal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-elevated card-3d group">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-secondary mx-auto mb-4 group-hover:scale-110 transition-transform duration-smooth" />
              <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Get personalized productivity advice and support
              </p>
              <Button asChild className="w-full bg-gradient-secondary hover:glow transition-all duration-smooth">
                <Link to="/chat" className="flex items-center gap-2">
                  Start Chat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;