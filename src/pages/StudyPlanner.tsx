import { StudyPlannerSection } from "@/components/StudyPlannerSection";
import { Navigation } from "@/components/Navigation";
import { Calendar, Brain } from "lucide-react";

const StudyPlanner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Navigation */}
      <Navigation />
      
      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-secondary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
              Study Planner
            </h1>
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your timetable and let AI create a personalized study plan optimized for your schedule
          </p>
        </div>
        
        {/* Study Planner Section Component */}
        <StudyPlannerSection />
      </div>
    </div>
  );
};

export default StudyPlanner;