import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Edit, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimetableData {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface TimetableUploadProps {
  onTimetableChange: (timetable: TimetableData | null) => void;
}

export const TimetableUpload = ({ onTimetableChange }: TimetableUploadProps) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'manual'>('file');
  const [manualSchedule, setManualSchedule] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a PDF or image file.",
        variant: "destructive"
      });
      return;
    }

    // Simulate file processing
    toast({
      title: "File Uploaded",
      description: "Your timetable is being processed. This feature will be enhanced soon!",
    });

    // Mock timetable data for demonstration
    const mockTimetable: TimetableData = {
      monday: ['Linear Algebra 9:00-10:30', 'Physics Lab 11:00-13:00', 'Programming 14:00-15:30'],
      tuesday: ['Thermodynamics 9:00-10:30', 'Mathematics 11:00-12:30', 'Circuit Analysis 14:00-15:30'],
      wednesday: ['Linear Algebra 9:00-10:30', 'Project Work 11:00-13:00'],
      thursday: ['Thermodynamics 9:00-10:30', 'Programming Lab 11:00-13:00', 'Mathematics 14:00-15:30'],
      friday: ['Circuit Analysis 9:00-10:30', 'Physics 11:00-12:30', 'Seminar 14:00-15:30'],
      saturday: ['Study Hall 10:00-12:00'],
      sunday: ['Free Day']
    };

    onTimetableChange(mockTimetable);
  };

  const handleManualSubmit = () => {
    if (!manualSchedule.trim()) {
      toast({
        title: "Empty Schedule",
        description: "Please enter your class schedule.",
        variant: "destructive"
      });
      return;
    }

    // Parse manual input (simplified)
    const lines = manualSchedule.split('\n').filter(line => line.trim());
    const timetable: TimetableData = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    // Simple parsing logic - in real app, this would be more sophisticated
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('monday') || lowerLine.includes('mon')) {
        timetable.monday.push(line);
      } else if (lowerLine.includes('tuesday') || lowerLine.includes('tue')) {
        timetable.tuesday.push(line);
      } else if (lowerLine.includes('wednesday') || lowerLine.includes('wed')) {
        timetable.wednesday.push(line);
      } else if (lowerLine.includes('thursday') || lowerLine.includes('thu')) {
        timetable.thursday.push(line);
      } else if (lowerLine.includes('friday') || lowerLine.includes('fri')) {
        timetable.friday.push(line);
      } else {
        // Default to adding general classes
        timetable.monday.push(line);
      }
    });

    onTimetableChange(timetable);
    toast({
      title: "Schedule Added",
      description: "Your manual schedule has been processed successfully!",
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'file' | 'manual')}>
        <TabsList className="grid w-full grid-cols-2 glass">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <Card className="glass border-dashed border-2 border-glass-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Upload Your Timetable</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a PDF or image of your class schedule
              </p>
              <Input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
                className="bg-surface/50 border-glass-border"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Enter Your Class Schedule
            </label>
            <Textarea
              placeholder={`Enter your schedule like this:
Monday: Linear Algebra 9:00-10:30, Physics Lab 11:00-13:00
Tuesday: Thermodynamics 9:00-10:30, Mathematics 11:00-12:30
Wednesday: Programming 14:00-15:30
...

Or just list your subjects and times, the AI will organize them optimally.`}
              value={manualSchedule}
              onChange={(e) => setManualSchedule(e.target.value)}
              className="min-h-[150px] bg-surface/50 border-glass-border resize-none"
            />
          </div>
          
          <Button 
            onClick={handleManualSubmit}
            className="w-full bg-gradient-primary hover:glow-primary transition-all duration-smooth"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Process Schedule
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};