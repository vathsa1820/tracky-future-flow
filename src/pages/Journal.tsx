import { JournalSection } from "@/components/JournalSection";
import { Navigation } from "@/components/Navigation";
import { BookOpen } from "lucide-react";

const Journal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Navigation */}
      <Navigation />
      
      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Personal Journal
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reflect on your daily experiences, track your growth, and maintain a positive mindset
          </p>
        </div>
        
        {/* Journal Section Component */}
        <JournalSection />
      </div>
    </div>
  );
};

export default Journal;