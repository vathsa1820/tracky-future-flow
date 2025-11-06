import { useState } from "react";
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
  const [timetable, setTimetable] = useState<TimetableData | null>(null);
  const [studyGoals, setStudyGoals] = useState('');
  const [examDates, setExamDates] = useState('');
  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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
    
    // Simulate AI processing with personalized plan
    setTimeout(() => {
      const generatedPlan: StudyPlan[] = [];
      let idCounter = 1;

      // Extract subjects from timetable or study goals
      const subjects: string[] = [];
      
      if (timetable) {
        Object.values(timetable).forEach(day => {
          day.forEach(classItem => {
            const subjectMatch = classItem.match(/^([^0-9]+)/);
            if (subjectMatch) {
              const subject = subjectMatch[1].trim();
              if (subject && !subjects.includes(subject)) {
                subjects.push(subject);
              }
            }
          });
        });
      }

      // Add subjects from study goals
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

      // Generate morning study session (7:00 - 8:30)
      if (subjects.length > 0) {
        generatedPlan.push({
          id: String(idCounter++),
          subject: subjects[0],
          timeSlot: '07:00 - 08:30',
          duration: '1.5 hours',
          activity: 'Morning Review Session',
          priority: 'high',
          description: 'Start your day with focused studying. Review key concepts and solve practice problems.'
        });
      }

      // Mid-morning study (9:00 - 10:30)
      if (subjects.length > 1) {
        generatedPlan.push({
          id: String(idCounter++),
          subject: subjects[1],
          timeSlot: '09:00 - 10:30',
          duration: '1.5 hours',
          activity: 'Deep Work Session',
          priority: 'high',
          description: 'Focus on challenging topics. Use active recall and practice problems.'
        });
      }

      // Break time (10:30 - 11:00)
      generatedPlan.push({
        id: String(idCounter++),
        subject: 'Break Time',
        timeSlot: '10:30 - 11:00',
        duration: '30 minutes',
        activity: 'Short Break',
        priority: 'medium',
        description: 'Take a walk, have a healthy snack, or do light stretching to refresh.'
      });

      // Pre-lunch study (11:00 - 12:30)
      if (subjects.length > 2) {
        generatedPlan.push({
          id: String(idCounter++),
          subject: subjects[2],
          timeSlot: '11:00 - 12:30',
          duration: '1.5 hours',
          activity: 'Practice & Application',
          priority: 'high',
          description: 'Apply concepts through exercises and real-world problem solving.'
        });
      }

      // Afternoon study (14:00 - 15:30)
      if (subjects.length > 3) {
        generatedPlan.push({
          id: String(idCounter++),
          subject: subjects[3] || subjects[0],
          timeSlot: '14:00 - 15:30',
          duration: '1.5 hours',
          activity: 'Concept Mastery',
          priority: 'medium',
          description: 'Review notes, create mind maps, and strengthen understanding.'
        });
      }

      // Exercise break (15:30 - 16:00)
      generatedPlan.push({
        id: String(idCounter++),
        subject: 'Physical Activity',
        timeSlot: '15:30 - 16:00',
        duration: '30 minutes',
        activity: 'Exercise Break',
        priority: 'medium',
        description: 'Physical activity boosts focus and memory retention. Go for a jog or do a quick workout.'
      });

      // Late afternoon (16:00 - 17:30)
      if (subjects.length > 0) {
        generatedPlan.push({
          id: String(idCounter++),
          subject: subjects[subjects.length > 4 ? 4 : 0],
          timeSlot: '16:00 - 17:30',
          duration: '1.5 hours',
          activity: 'Review & Consolidation',
          priority: 'medium',
          description: 'Review what you learned today. Test yourself with flashcards or practice questions.'
        });
      }

      // Evening planning (19:00 - 20:00)
      generatedPlan.push({
        id: String(idCounter++),
        subject: 'Daily Review',
        timeSlot: '19:00 - 20:00',
        duration: '1 hour',
        activity: 'Journal & Planning',
        priority: 'low',
        description: 'Reflect on today\'s progress, journal your learning, and plan tomorrow\'s priorities.'
      });

      // Add exam-focused sessions if exam dates provided
      if (examDates.trim()) {
        generatedPlan.push({
          id: String(idCounter++),
          subject: 'Exam Preparation',
          timeSlot: '20:00 - 21:00',
          duration: '1 hour',
          activity: 'Exam-Focused Study',
          priority: 'high',
          description: `Focus on upcoming exams: ${examDates.slice(0, 50)}. Practice past papers and review key formulas.`
        });
      }
      
      setStudyPlan(generatedPlan);
      setIsGenerating(false);
      
      toast({
        title: "Study Plan Generated! 🎉",
        description: `Created ${generatedPlan.length} personalized study sessions for you.`,
      });
    }, 2500);
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
    </div>
  );
};