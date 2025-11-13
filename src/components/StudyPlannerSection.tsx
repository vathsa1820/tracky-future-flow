import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TimetableUpload } from "./TimetableUpload";
import { Upload, Brain, Calendar, Clock, Target, Sparkles, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyPlan {
  id: string;
  subject: string;
  timeSlot: string;
  duration: string;
  activity: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

interface TimetableData {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export const StudyPlannerSection = () => {
  const [timetable, setTimetable] = useState<TimetableData | File | null>(null);
  const [studyGoals, setStudyGoals] = useState('');
  const [examDates, setExamDates] = useState('');
  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load study plans from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('studyPlans');
    if (stored) {
      setStudyPlan(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // Save study plans to localStorage whenever they change
  useEffect(() => {
    if (!loading && studyPlan.length > 0) {
      localStorage.setItem('studyPlans', JSON.stringify(studyPlan));
    }
  }, [studyPlan, loading]);

  const generateStudyPlan = async () => {
    if (!timetable && !studyGoals.trim()) {
      toast({
        title: "Missing Information",
        description: "Please upload your timetable or add study goals to generate a plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Check if timetable is a File object (uploaded file)
      if (timetable instanceof File) {
        // Use the edge function to analyze the uploaded file
        const formData = new FormData();
        formData.append('file', timetable);
        formData.append('studyGoals', studyGoals);
        formData.append('examDates', examDates);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-timetable`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to analyze timetable');
        }

        const data = await response.json();
        setStudyPlan(data.studyPlan);
        
        toast({
          title: "Study Plan Generated! 🎉",
          description: `Created ${data.studyPlan.length} personalized study sessions based on your timetable.`,
        });
      } else {
        // Fallback for manual entry or no file
        const generatedPlan: StudyPlan[] = [];
        let idCounter = 1;

        const subjects: string[] = [];
        
        if (studyGoals.trim()) {
          const goalLines = studyGoals.split('\n');
          goalLines.forEach(line => {
            const words = line.split(/[,;]/).map(s => s.trim());
            words.forEach(word => {
              if (word.length > 3 && !subjects.includes(word)) {
                subjects.push(word);
              }
            });
          });
        }

        // Generate basic study plan
        if (subjects.length > 0) {
          generatedPlan.push({
            id: String(idCounter++),
            subject: subjects[0],
            timeSlot: '08:00 - 09:30',
            duration: '1.5 hours',
            activity: 'Morning Study Session',
            priority: 'high',
            description: 'Start your day with focused studying on key concepts.'
          });

          if (subjects.length > 1) {
            generatedPlan.push({
              id: String(idCounter++),
              subject: subjects[1],
              timeSlot: '10:00 - 11:30',
              duration: '1.5 hours',
              activity: 'Deep Work Session',
              priority: 'high',
              description: 'Focus on challenging topics with active learning.'
            });
          }
        }

        generatedPlan.push({
          id: String(idCounter++),
          subject: 'Break',
          timeSlot: '14:00 - 14:30',
          duration: '30 minutes',
          activity: 'Refresh Break',
          priority: 'medium',
          description: 'Take a walk or do light exercise to refresh your mind.'
        });

        if (subjects.length > 0) {
          generatedPlan.push({
            id: String(idCounter++),
            subject: subjects[0],
            timeSlot: '15:00 - 16:30',
            duration: '1.5 hours',
            activity: 'Practice & Review',
            priority: 'medium',
            description: 'Work on practice problems and review your notes.'
          });
        }

        generatedPlan.push({
          id: String(idCounter++),
          subject: 'Planning',
          timeSlot: '19:00 - 20:00',
          duration: '1 hour',
          activity: 'Daily Review',
          priority: 'low',
          description: 'Reflect on what you learned and plan for tomorrow.'
        });

        setStudyPlan(generatedPlan);
        
        toast({
          title: "Study Plan Generated! 🎉",
          description: `Created ${generatedPlan.length} study sessions for you.`,
        });
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate study plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
    }
  };

  const getActivityIcon = (activity: string) => {
    if (activity.toLowerCase().includes('break') || activity.toLowerCase().includes('exercise')) {
      return <Target className="h-4 w-4" />;
    }
    if (activity.toLowerCase().includes('review') || activity.toLowerCase().includes('study')) {
      return <BookOpen className="h-4 w-4" />;
    }
    return <Brain className="h-4 w-4" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timetable Upload */}
        <Card className="glass-elevated card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimetableUpload onTimetableChange={setTimetable} />
          </CardContent>
        </Card>

        {/* Study Goals & Exam Dates */}
        <Card className="glass-elevated card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Study Goals & Exams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Study Goals</label>
              <Textarea
                placeholder="What subjects do you want to focus on? What are your learning objectives?"
                value={studyGoals}
                onChange={(e) => setStudyGoals(e.target.value)}
                className="bg-surface/50 border-glass-border resize-none"
                rows={4}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Upcoming Exams</label>
              <Textarea
                placeholder="List your exam dates and subjects (e.g., Linear Algebra - March 15, Thermodynamics - March 22)"
                value={examDates}
                onChange={(e) => setExamDates(e.target.value)}
                className="bg-surface/50 border-glass-border resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Plan Button */}
      <div className="text-center">
        <Button
          onClick={generateStudyPlan}
          disabled={isGenerating}
          className="bg-gradient-secondary hover:glow transition-all duration-smooth px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin"></div>
                Generating Your Plan...
              </div>
            </>
          ) : (
            <>
              <Brain className="h-5 w-5 mr-2" />
              Generate AI Study Plan
              <Sparkles className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Generated Study Plan */}
      {studyPlan.length > 0 && (
        <Card className="glass-elevated card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Your Personalized Study Plan
              <Sparkles className="h-4 w-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studyPlan.map((item) => (
                <Card key={item.id} className="glass card-3d">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getActivityIcon(item.activity)}
                        <div>
                          <h4 className="font-medium text-foreground">{item.subject}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{item.timeSlot}</span>
                            <span>•</span>
                            <span>{item.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="font-medium text-primary mb-1">{item.activity}</h5>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 p-4 glass rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="font-medium">AI Tips for Success</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take 5-10 minute breaks between study sessions</li>
                <li>• Review previous day's material for 15 minutes each morning</li>
                <li>• Use active recall techniques instead of passive reading</li>
                <li>• Adjust the plan based on your energy levels throughout the day</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
        </>
      )}
    </div>
  );
};